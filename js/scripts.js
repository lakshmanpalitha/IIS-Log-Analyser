(function($) {  
  
	$(document).ready(function() {
	  $('.query-editor').simpleIntellisense();
	  
	  $('.button-section button').click(function () {
		  $('.query-editor').simpleIntellisense('getValue');
	  });
	});
  
})(jQuery);