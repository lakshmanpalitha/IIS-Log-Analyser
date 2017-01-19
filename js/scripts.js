(function($) {  
  
	$(document).ready(function() {
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
	});
  
})(jQuery);