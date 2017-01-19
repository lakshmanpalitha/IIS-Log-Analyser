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
    public class LogAnalyzerController : Controller
    {
        public ActionResult Home()
        {
            return View();
        }
        // GET: LogAnalyzer
        [HttpPost]
        public ActionResult Index(string path, string query)
        {
            var value = ParseW3CLog();
            return PartialView(value);
        }

        public DataTable ParseW3CLog()
        {
            var logParser = new LogQueryClass();
            var w3Clog = new COMW3CInputContextClass();
            var recordsTable = new DataTable();
            var columns = new List<string>();

            var strSql = @"SELECT TOP 10 * FROM D:\logs\test.log";

            var recordSet = logParser.Execute(strSql, w3Clog);

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
    }
}