using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MSUtil;

namespace IISLogAnalyzer.Controllers
{
    public class LogAnalyzerController : Controller
    {
        // GET: LogAnalyzer
        public ActionResult Index()
        {
            return View();
        }

        //The passing argument "userID" is just the 
        //folder name for the bandwidth used need to be retrieved.
        //This is just for demonstration. 
        //Re structure the SQL query for your needs.

        public double ParseW3CLog(string userId)
        {

            // prepare LogParser Recordset & Record objects

            double usedBw;

            var logParser = new LogQueryClass();
            var w3Clog = new COMW3CInputContextClass();

            //W3C Logparsing SQL. Replace this SQL query with whatever 
            //you want to retrieve. The example below 
            //will sum up all the bandwidth
            //Usage of a specific folder with name 
            //"userID". Download Log Parser 2.2 
            //from Microsoft and see sample queries.

            var strSql = @"SELECT SUM(sc-bytes) from C:\\logs" +
                         @"\\*.log WHERE cs-uri-stem LIKE '%/" +
                         userId + "/%' ";

            // run the query against W3C log
            var rsLp = logParser.Execute(strSql, w3Clog);

            var rowLp = rsLp.getRecord();

            if (rowLp.getValue(0).ToString() == "0" ||
                rowLp.getValue(0).ToString() == "")
            {
                //Return 0 if an err occured
                usedBw = 0;
                return usedBw;
            }

            //Bytes to MB Conversion
            double bytes = Convert.ToDouble(rowLp.getValue(0).ToString());
            usedBw = bytes / (1024 * 1024);

            //Round to 3 decimal places
            usedBw = Math.Round(usedBw, 3);

            return usedBw;
        }
    }
}