(function ($) {

    $(document).ready(function () {
        $('.query-editor').simpleIntellisense();

        $('.run-query').click(function () {
            var queryEditor = $(this).parents('.query-editor-holder').find('.query-editor'),
                query = queryEditor[0].innerText;

            console.log(query);
            //	        $.ajax({
            //	            url: 'demo_test.txt',
            //	            success: function (result) {
            //	                $('#').html(result);
            //	            }
            //	        });
        });

        //TO BE EDITED
        $("#results").html('');

        $("#btnQuery").click(function () {

            var path = $("#txtLogFilePath").val();
            var query = $("#txtQuery").val();
            var logType = $("#dropLogType").val();

            $.ajax({
                type: 'POST',
                url: "Index",
                data: { path: path, query: query, logType: logType },
                success: function (data) {
                    $("#results").html(data);
                }
            });
        });
    });


})(jQuery);