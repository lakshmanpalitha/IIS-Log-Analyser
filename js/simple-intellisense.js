
(function ($) {
	$.fn.simpleIntellisense = function(options) {
		
		if (options != null && options == "getValue") {
			alert($('.query-editor', this).val());
			return;
		}
		
		var settings = $.extend({
			'hints': ['select', 'p_id', 'p_name', 'p_description'],
			'ignoreKeyCodes': [13, 32]
		}, options);

        var toolTip = "<div class='tip-wrapper'></div>";
        $('body').append(toolTip);
		
		var position = 0;

        return this.each(function () {
            var $this = $(this);

            $('body').on('click', '.tip-wrapper div', function () {
                var suggestion = $(this)[0].innerHTML;
                replaceWord(suggestion, $element);
            });
			
			$this.append('<textarea class="query-editor"></textarea>')
			var $element = $('.query-editor', $this);
            $element.keypress(function (e) {
                if ($.inArray(e.keyCode, settings.ignoreKeyCodes) > -1) {
                    return;
                }
                var key = String.fromCharCode(e.which);
                var hints = getHints($element, key);
                if (hints.length > 0) {
                    showHints(hints);
                }
            });
        });

        function getText($element) {
            return $element.val();
        }

        function getTerm($element, key) {
            var caretPosition = $element[0].selectionStart;			
			position = caretPosition;
            if (caretPosition > 0) {
                var query = getText($element);
                var queryUptoCaret = query.substring(0, caretPosition);
                var endSpace = /\s$/;
                if (!(endSpace.test(queryUptoCaret))) {
					var length = queryUptoCaret.length;
					for (var index = queryUptoCaret.length - 1; index > 0; index--) {
						if (queryUptoCaret[index] == ' ') {							
							break;
						}
						length--;
					}
                    var term = queryUptoCaret.substring(length, caretPosition) + key;
                    return term;
                }
                else {
					replaceWordStartIndex = queryUptoCaret.length;
                    return key;
                }
            }
            else {
				replaceWordStartIndex = 0;
                return key;
            }
        }

        function getHints($element, key) {
            var term = getTerm($element, key);
            var hints = $.grep(settings.hints, function (item, i) {
                return item.toLowerCase().startsWith(term.toLowerCase());
            });
            return hints;
        }

        function showHints(hints) {
            var hintsList = "";
            $.each(hints, function (i, value) {
                hintsList = hintsList + '<div class="option">' + hints[i] + '</div>';
            });

            $('.tip-wrapper').html(hintsList);
        }

        function replaceWord(word, $element) {
			var caretPosition = position + 1;	
            var query = getText($element);
			var queryUptoCaret = query.substring(0, caretPosition);
			var start = queryUptoCaret.length;
			var index;
			for (index = queryUptoCaret.length; index > 0; index--) {
				if (queryUptoCaret[index] == ' ') {							
					break;
				}
				start--;
			}
			var end = start;
			for (index = start; index < query.length; index++) {
				if (query[index] == ' ') {							
					break;
				}
				end++;
			}
			
			var max = query.length;
			var q = query.substring(0, start);
			if (start > 0) {
				q = q + ' ';
			}
			q = q + word;
			if (end > start) {
				q = q + ' ' + query.substring(end, max);
			}
			$element.val(q);
        }
    };
})(jQuery);