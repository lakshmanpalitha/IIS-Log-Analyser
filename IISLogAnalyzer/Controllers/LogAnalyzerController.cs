using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using IISLogAnalyzer.Models;
using MSUtil;

namespace IISLogAnalyzer.Controllers
{
    public class AnalyzerResultModel
    {
        public DataTable ResultsTable = new DataTable();
        public bool Error;
        public string ErrorMessage;
    }

    public class LogAnalyzerController : Controller
    {


        public ActionResult Home()
        {
            return View();
        }

        // GET: LogAnalyzer
        [HttpPost]
        public ActionResult Index(string path, string query, string logType)
        {
            //try
            //{
            //    var value = ParseW3CLog(path, query, logType);
            //}
            //catch (Exception)
            //{
                
            //}
            var value = ParseW3CLog(path, query, logType);
            return PartialView(value);
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
                columns.Add(recordSet.getColumnName(i));
                recordsTable.Columns.Add(recordSet.getColumnName(i));
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

        public string BuildQuery(string path, string query,string toDate = "", string fromDate = "")
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