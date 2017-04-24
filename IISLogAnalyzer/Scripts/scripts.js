(function ($) {

    $(document).ready(function () {
        $('.query-editor-container').simpleIntellisense();

        $("#btnQuery").click(function () {

            var path = $("#txtLogFilePath").val(),
                query = $('.query-editor-container').simpleIntellisense('getValue'),
                logType = $("#dropLogType").val(),
                fromDate = $("#from").val(),
                toDate = $("#to").val(),
                fromTime = $("#timeFrom").val(),
                toTime = $("#timeTo").val(),
                $loader = $('.loading');

           $loader.show();

	        $.ajax({
	            type: 'POST',
	            url: "/LogAnalyzer/Index",
	            data: { query: query, logType: logType, numberOfExistingRecords: 0, fromDate: fromDate, toDate: toDate, fromTime: fromTime, toTime: toTime },
	            success: function (data) {
	                $("#results").html(data);
	                $loader.show();
	            }
	        });
        });

        $(function () {
            var dateFormat = 'yy-mm-dd';
            $("#to").datepicker({ dateFormat: dateFormat });
            $("#from").datepicker({ dateFormat: dateFormat }).bind("change", function () {
                var minValue = $(this).val();
                minValue = $.datepicker.parseDate(dateFormat, minValue);
                minValue.setDate(minValue.getDate() + 1);
                $("#to").datepicker("option", "minDate", minValue);
            });
        });



    });


})(jQuery);