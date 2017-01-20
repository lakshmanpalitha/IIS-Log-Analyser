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
	});


})(jQuery);