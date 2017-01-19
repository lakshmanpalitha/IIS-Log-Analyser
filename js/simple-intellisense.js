(function ($) {
	$.fn.simple-intellisense = function(options ) {
		
		var settings = $.extend({
			'hints': ['select', 'p_id', 'p_name', 'p_description']
		}, options);

		return this.each(function() {
			var $this = $(this);
			
			$this.keyup( function( e ) {
				var character = string.fromCharCode(e.which);
			});
		}
	};
})(jQuery);