(function ($) {
    var toolTip = "<div class='tip-wrapper'></div>";
    $('body').append(toolTip);

    $.fn.simpleIntellisense = function (options) {
		
		var settings = $.extend({
			'hints': ['select', 'p_id', 'p_name', 'p_description'],
			'ignoreKeyCodes': [13]
		}, options);

		return this.each(function() {
		    var $element = $(this);

		    $('body').on('click', '.tip-wrapper div', function () {
		        alert('ok');
		    });
			
			$element.keypress( function(e) {
				var key = String.fromCharCode(e.which);
				var hints = getHints($element, key);
				if (hints.length > 0) {
					showHints(hints, e);
				}
			});
		});
		
		function getHints($element, key) {
			var text = $element.text();
			$.grep(settings.hints, function(item, i) {
					
			});
			return settings.hints;
		}
		
		function showHints(hints, e) {
		    var hintsList = "",
		         hints = hints,
		         countries = ['United States', 'Canada', 'Argentina', 'Armenia'];

		    $.each(countries, function (i, value) {
		        hintsList = hintsList + '<div class="option">' + hints[i] + '</div>';
		    });

		    $('.tip-wrapper').html(cuntryList)

		}


		

	};
})(jQuery);