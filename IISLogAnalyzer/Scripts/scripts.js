(function ($) {

    $(document).ready(function () {
        $('.query-editor-container').simpleIntellisense();

        $("#btnQuery").click(function () {

            var path = $("#txtLogFilePath").val();
            var query = $('.query-editor-container').simpleIntellisense('getValue');
            var logType = $("#dropLogType").val();

	        $.ajax({
	            type: 'POST',
	            url: "/LogAnalyzer/Index",
	            data: { path: path, query: query, logType: logType},
	            success: function (data) {
	                $("#results").html(data);
	            }
	        });
	    });


        $(function () {
            var dateFormat = "mm/dd/yy",
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