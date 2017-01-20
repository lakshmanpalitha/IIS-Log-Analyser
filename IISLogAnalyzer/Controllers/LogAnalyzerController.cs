using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;
using MSUtil;

namespace IISLogAnalyzer.Controllers
{
    public class AnalyzerResultModel
    {
        public DataTable ResultsTable = new DataTable();
        public bool Error;
        public string ErrorMessage;
        public string TimeTaken;

    }

    public class LogAnalyzerController : Controller
    {


        public ActionResult Home()
        {
            return View();
        }

        // GET: LogAnalyzer
        [HttpPost]
        public ActionResult Index(string path, string query, string logType, int numberOfRecords)
        {
            var resultsModel = new AnalyzerResultModel();
            var recordsToRetrive = 10;

            try
            {
                var stopWatch = new Stopwatch();

                stopWatch.Start();
                var resultsTable = ParseW3CLog(path, query, logType);
                if (numberOfRecords > 0)
                {
                    recordsToRetrive = numberOfRecords + recordsToRetrive;
                    resultsModel.ResultsTable = resultsTable.Rows.Cast<DataRow>().Skip(numberOfRecords).Take(recordsToRetrive).CopyToDataTable();
                }
                resultsModel.ResultsTable = resultsTable.Rows.Cast<DataRow>().Skip(numberOfRecords).Take(recordsToRetrive).CopyToDataTable();
                stopWatch.Stop();

                TimeSpan ts = stopWatch.Elapsed;
                resultsModel.TimeTaken = $"Execution time :{ts.Hours:00}:{ts.Minutes:00}:{ts.Seconds:00}.{ts.Milliseconds / 10:00}";
            }
            catch (Exception ex)
            {
                resultsModel.Error = true;
                resultsModel.ErrorMessage = ex.Message;
            }
            return PartialView(resultsModel);
        }

        public DataTable ParseW3CLog(string path, string query, string logType)
        {
            var logParser = new LogQueryClass();

            var recordsTable = new DataTable();
            var columns = new List<string>();

            var strSql = BuildQuery(path, query);

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

        public string BuildQuery(string path, string query, string toDate = "", string fromDate = "")
        {
            var finalQuery = string.Empty;

            if (string.IsNullOrEmpty(query))
            {
                throw new Exception("Please provide the query");
            }

            if (string.IsNullOrEmpty(path))
            {
                throw new Exception("Please provide log file path");
            }

            finalQuery = query.Replace("{path}", path);

            if (!string.IsNullOrEmpty(toDate))
            {

            }

            if (!string.IsNullOrEmpty(fromDate))
            {

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
    }
}