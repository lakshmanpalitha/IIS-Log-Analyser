(function($) {  
  
	$(document).ready(function() {
	  $('.query-editor-container').simpleIntellisense();
	  
	  $('.button-section button').click(function () {
		  $('.query-editor-container').simpleIntellisense('getValue');
	  });
	});
  
})(jQuery);