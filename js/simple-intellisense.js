(function ($) {
	$.fn.simpleIntellisense = function(options) {
		
		var settings = $.extend({
			'hints': ['select', 'p_id', 'p_name', 'p_description'],
			'ignoreKeyCodes': [13]
		}, options);

		return this.each(function() {
			var $element = $(this);
			
			$element.keypress( function(e) {
				var key = String.fromCharCode(e.which);
				var hints = getHints($element, key);
				if (hints.length > 0) {
					showHints(hints);
				}
			});
		});
		
		function getHints($element, key) {
			var text = $element.text();
			$.grep(settings.hints, function(item, i) {
					
			});
			return settings.hints;
		}
		
		function showHints(hints) {
			alert(hints);
		}
	};
})(jQuery);