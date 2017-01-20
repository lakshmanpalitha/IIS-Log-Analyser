
(function ($) {
    $.fn.simpleIntellisense = function (options) {

        var editor = $('.query-editor'),
            editorWidth = editor.outerWidth,
            editorleft = editor.position().left,
            editorTop = editor.position().top,
            toolTipLeft = editorleft + editorWidth;
            toolTip = '<div class="tip-wrapper" style="left:'+toolTipLeft+'px; top:'+editorTop+'px"></div>';
        $('body').append(toolTip);

        var settings = $.extend({
            'hints': ['select', 'p_id', 'p_name', 'p_description'],
            'ignoreKeyCodes': [13]
        }, options);

        return this.each(function () {
            var $element = $(this);

            $('body').on('click', '.tip-wrapper div', function () {
                var suggestion = $(this)[0].innerHTML;
                replaceWord(suggestion);
            });

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

        function getCaretPosition($element) {
            var caretPosition = 0, selection, range;
            if (window.getSelection) {
                selection = window.getSelection();
                if (selection.rangeCount) {
                    range = selection.getRangeAt(0);
                    /**
                    if (range.commonAncestorContainer.parentNode == $element[0]) {
                      caretPosition = range.endOffset;
                    }
                    **/
                    caretPosition = range.endOffset;
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                if (range.parentElement() == $element) {
                    var tempElement = document.createElement("span");
                    $element.insertBefore(tempElement, $element.firstChild);
                    var tempRange = range.duplicate();
                    tempRange.moveToElementText(tempElement);
                    tempRange.setEndPoint("EndToEnd", range);
                    caretPosition = tempRange.text.length;
                }
            }
            console.log(caretPosition);
            return caretPosition;
        }

        function getText($element) {
            return $element.text();
        }

        function getTerm($element, key) {
            var caretPosition = getCaretPosition($element);
            if (caretPosition > 0) {
                var query = getText($element);
                var queryUptoCaret = query.substring(0, caretPosition);
                var endSpace = /\s$/;
                if (!(endSpace.test(queryUptoCaret))) {
                    var lastSpace = queryUptoCaret.lastIndexOf(' ');
                    var term = queryUptoCaret.substring(lastSpace + 1, caretPosition) + key;
                    return term;
                }
                else {
                    return key;
                }
            }
            else {
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

        function replaceWord(word) {
            
        }
    };
})(jQuery);