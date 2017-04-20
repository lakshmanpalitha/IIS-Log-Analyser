(function ($) {

    $(document).ready(function () {
        $('.query-editor-container').simpleIntellisense();

        $("#btnQuery").click(function () {

            var path = $("#txtLogFilePath").val(),
                query = $('.query-editor-container').simpleIntellisense('getValue'),
                logType = $("#dropLogType").val(),
                fromDate = $("#from").val(),
                toDate = $("#to").val(),
                $loader = $('.loading');

           $loader.show();

	        $.ajax({
	            type: 'POST',
	            url: "/LogAnalyzer/Index",
	            data: { query: query, logType: logType, numberOfExistingRecords: 0, fromDate: fromDate, toDate: toDate },
	            success: function (data) {
	                $("#results").html(data);
	                $loader.show();
	            }
	        });
	    });


        $(function () {
            var dateFormat = "mm-dd-yy",
                from = $("#from")
                    .datepicker({
                        defaultDate: "+1w",
                        numberOfMonths: 1
                    })
                    .on("change", function () {
                        to.datepicker("option", "minDate", getDate(this));
                    }),
                to = $("#to").datepicker({
                    defaultDate: "+1w",
                    numberOfMonths: 1
                })
                .on("change", function () {
                    from.datepicker("option", "maxDate", getDate(this));
                });

            function getDate(element) {
                var date;
                try {
                    date = $.datepicker.parseDate(dateFormat, element.value);
                } catch (error) {
                    date = null;
                }

                return date;
            }
        });



    });


})(jQuery);