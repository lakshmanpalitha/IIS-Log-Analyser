using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;
using MSUtil;
using Microsoft.Web.Administration;
using System.IO;
using Microsoft.SqlServer.Server;

namespace IISLogAnalyzer.Controllers
{
    public class AnalyzerResultModel
    {
        public DataTable ResultsTable = new DataTable();
        public bool Error;
        public string ErrorMessage;
        public string TimeTaken;
        public int NumberOfExistingRecords;

    }

    public class LogAnalyzerController : Controller
    {


        public ActionResult Home()
        {
            return View();
        }

        // GET: LogAnalyzer
        [HttpPost]
        public ActionResult Index(string query, string logType, int numberOfExistingRecords, string fromDate, string toDate)
        {
            var resultsModel = new AnalyzerResultModel();
            var recordsToRetrive = GetPageRecordCount();
            //var logFilePath = System.Configuration.ConfigurationManager.AppSettings["logFilePath"];
            var siteName = System.Web.Hosting.HostingEnvironment.ApplicationHost.GetSiteName();
            var logFilePath = GetLogPath("wagamama.local");

            try
            {
                var stopWatch = new Stopwatch();

                stopWatch.Start();
                var resultsTable = ParseW3CLog(logFilePath, query, logType, fromDate, toDate);

                if (recordsToRetrive < 0 || resultsTable.Rows.Count <= numberOfExistingRecords)
                {
                    resultsModel.ResultsTable = resultsTable;
                    resultsModel.NumberOfExistingRecords = resultsTable.Rows.Count;
                }
                else 
                {
                    resultsModel.ResultsTable = resultsTable.Rows.Cast<DataRow>().Skip(numberOfExistingRecords).Take(recordsToRetrive).CopyToDataTable();
                    resultsModel.NumberOfExistingRecords = numberOfExistingRecords + recordsToRetrive;
                }

                stopWatch.Stop();

                var ts = stopWatch.Elapsed;
                resultsModel.TimeTaken = $"Execution time :{ts.Hours:00}:{ts.Minutes:00}:{ts.Seconds:00}.{ts.Milliseconds / 10:00}";
            }
            catch (Exception ex)
            {
                resultsModel.Error = true;
                resultsModel.ErrorMessage = ex.Message;
            }
            return PartialView(resultsModel);
        }

        public int GetPageRecordCount()
        {
            var pageRecordCount = System.Configuration.ConfigurationManager.AppSettings["ResultRecordCount"];
            int count;
            if (int.TryParse(pageRecordCount, out count))
            {
                return count;    
            }
            return -1;
            
        }

        public DataTable ParseW3CLog(string path, string query, string logType, string fromDate, string toDate)
        {
            var logParser = new LogQueryClass();

            var recordsTable = new DataTable();
            var columns = new List<string>();

            var strSql = BuildQuery(path, query, fromDate, toDate);

            var recordSet = logParser.Execute(strSql, GetLogTypeClass(logType));

            for (var i = 0; i < recordSet.getColumnCount(); i++)
            {
                var columnName = recordSet.getColumnName(i);
                columns.Add(columnName);
                recordsTable.Columns.Add(columnName);
            }

            for (; !recordSet.atEnd(); recordSet.moveNext())
            {
                var row = recordSet.getRecord();

                var newTableRow = recordsTable.NewRow();

                foreach (var column in columns)
                {
                    newTableRow[column] = row.getValue(column)?.ToString();
                }

                recordsTable.Rows.Add(newTableRow);
            }
            return recordsTable;
        }

        public string BuildQuery(string path, string query, string toDate, string fromDate)
        {
            if (string.IsNullOrEmpty(query))
            {
                throw new Exception("Please provide the query");
            }

            if (string.IsNullOrEmpty(path))
            {
                throw new Exception("Please provide log file path");
            }

            var finalQuery = query.Replace("{path}", path+ "\\*.log");

            if (!finalQuery.Contains("{Date}"))
            {
                return finalQuery;
            }

            if (!string.IsNullOrEmpty(fromDate) && !string.IsNullOrEmpty(toDate))
            {
                finalQuery = finalQuery.Replace("{Date}", "Date > " + fromDate + " and  Date < " + toDate);
            }

            return finalQuery;
        }

        public object GetLogTypeClass(string logType)
        {
            object logTypeClass;
            switch (logType)
            {
                case "W3CLOG":
                    logTypeClass = new COMW3CInputContextClass();
                    break;
                case "IISLOG":
                    logTypeClass = new COMIISIISInputContextClass();
                    break;
                default:
                    logTypeClass = new COMW3CInputContextClass();
                    break;
            }
            return logTypeClass;
        }

        private string GetLogPath(string siteName)
        {
            ServerManager manager = new ServerManager();
            var mySite = manager.Sites[siteName];

            if (mySite == null)
            {
                return string.Empty;
            }

            var logPath = mySite.LogFile.Directory + "\\W3svc" + mySite.Id.ToString();

            //if (Directory.Exists(logPath))
            //{
            //    return mySite.LogFile.Directory + "\\W3svc" + mySite.Id.ToString();
            //}

            return logPath;
        }
    }
}