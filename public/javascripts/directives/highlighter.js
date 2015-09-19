jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

(function ($) {
    /*
     * Code for triple click from
     * http://css-tricks.com/snippets/jquery/triple-click-event/
     */
    $.event.special.tripleclick = {

        setup: function (data, namespaces) {
            var elem = this,
                $elem = jQuery(elem);
            $elem.bind('click', jQuery.event.special.tripleclick.handler);
        },

        teardown: function (namespaces) {
            var elem = this,
                $elem = jQuery(elem);
            $elem.unbind('click', jQuery.event.special.tripleclick.handler);
        },

        handler: function (event) {
            var elem = this,
                $elem = jQuery(elem),
                clicks = $elem.data('clicks') || 0;
            clicks += 1;
            if (clicks === 3) {
                clicks = 0;

                // set event type to "tripleclick"
                event.type = "tripleclick";

                // let jQuery handle the triggering of "tripleclick" event handlers
                jQuery.event.dispatch.apply(this, arguments);
            }
            $elem.data('clicks', clicks);
        }
    };

    /*
     * Attempt to get the previous sibling
     * of a container in the event of a triple
     * click.
     *
     * Adapted from http://stackoverflow.com/a/574922
     */
    function get_previoussibling(n) {
        var y = n, x;
        try {
            x = n.previousSibling;
            while (x && x.nodeType != 1) {
                y = x;
                x = x.previousSibling;
            }
        } catch (err) {
            console.log(err);
            topOffset = -15;
            return y;
        }
        return x ? x : y;
    }

    var methods = {
        init: function (options) {

            var settings = $.extend({
                'selector': '.highlighter-container',
                'minWords': 0,
                'complete': function() {}
            }, options);
            var numClicks = 0;
            var topOffset = 0;
            var leftOffset = 0;
            var isDown = false;

        var selText;

            return this.each(function () {
                /*
                 * Insert an html <span> after a user selects text.
                 * We then use the X-Y coordinates of that span
                 * to place our tooltip.
                 * Thanks to http://stackoverflow.com/a/3599599 for
                 * some inspiration.
                 */
                function insertSpanAfterSelection(clicks) {
                    var html = "<span class='dummy'><span>";
                    topOffset = 0;
                    leftOffset = 0;
                    if (numClicks !== clicks) return;
                    var isIE = (navigator.appName === "Microsoft Internet Explorer");
                    var sel, range, expandedSelRange, node;
                    var position;
                    if (window.getSelection) {
                        sel = window.getSelection();
                        selText = sel.toString();

                        if ($.trim(selText) === '' || selText.split(' ').length < settings.minWords) return;

                        if (sel.getRangeAt && sel.rangeCount) {
                            range = window.getSelection().getRangeAt(0);

                            expandedSelRange = range.cloneRange();
                            expandedSelRange.collapse(false);

                            // Range.createContextualFragment() would be useful here but is
                            // non-standard and not supported in all browsers (IE9, for one)
                            var el = document.createElement("div");
                            el.innerHTML = html;
                            var dummy = document.createElement("span");

                            if (range.startOffset === 0 && range.endOffset === 0) {

                                var cont = expandedSelRange.startContainer;
                                var prev = get_previoussibling(cont);
                                try {
                                    expandedSelRange.selectNode(prev.lastChild);
                                } catch (err) {
                                    leftOffset = 40;
                                    topOffset = -15;
                                    expandedSelRange.selectNode(prev);
                                }
                                // console.log(expandedSelRange);
                                expandedSelRange.collapse(false);
                            } else if(range.endOffset === 0 ) {
                                topOffset = -25;
                                leftOffset = 40;
                            }


                            if (numClicks !== clicks) return;
                            $(settings.selector).hide();
                            if (!isIE && $.trim(selText) === $.trim(expandedSelRange.startContainer.innerText)) {
                                expandedSelRange.startContainer.innerHTML += "<span class='dummy'>&nbsp;</span>";
                                position = $(".dummy").offset();
                                $(".dummy").remove();
                            } else if (!isIE && $.trim(selText) === $.trim(expandedSelRange.endContainer.innerText)) {
                                expandedSelRange.endContainer.innerHTML += "<span class='dummy'>&nbsp;</span>";
                                position = $(".dummy").offset();
                                $(".dummy").remove();
                            } else {
                                expandedSelRange.insertNode(dummy);
                                position = $(dummy).offset();
                                dummy.parentNode.removeChild(dummy);
                            }
                        }
                    } else if (document.selection && document.selection.createRange) {
                        range = document.selection.createRange();
                        expandedSelRange = range.duplicate();

                        selText = expandedSelRange.text;
                        if ($.trim(selText) === '' || selText.split(' ').length < settings.minWords) return;

                        range.collapse(false);
                        range.pasteHTML(html);

                        expandedSelRange.setEndPoint("EndToEnd", range);
                        expandedSelRange.select();
                        position = $(".dummy").offset();
                        $(".dummy").remove();
                    }

                    $(settings.selector).css("top", position.top + topOffset + "px");
                    $(settings.selector).css("left", position.left + leftOffset + "px");
                    $(settings.selector).show(300, function() {
                        settings.complete(selText);
                    });
                }
                $(settings.selector).hide();
                $(settings.selector).css("position", "absolute");
                $(document).bind('mouseup.highlighter', function (e) {
                    if (isDown) {
                        numClicks = 1;
                        clicks = 0;
                        setTimeout(function () {
                            insertSpanAfterSelection(1);
                        }, 300);
                        isDown = false;
                    }
                });
                $(this).bind('mouseup.highlighter', function (e) {
                    numClicks = 1;
                    clicks = 0;
                    setTimeout(function () {
                        insertSpanAfterSelection(1);
                    }, 300);
                });
                $(this).bind('tripleclick.highlighter', function (e) {
                    numClicks = 3;
                    setTimeout(function () {
                        insertSpanAfterSelection(3);
                    }, 200);
                });

                $(this).bind('dblclick.highlighter', function (e) {
                    numClicks = 2;
                    setTimeout(function () {
                        insertSpanAfterSelection(2);
                    }, 300);
                });
                $(this).bind('mousedown.highlighter', function (e) {
                    $(settings.selector).hide();
                    isDown = true;
                });

            });
        },
        destroy: function (content) {
            return this.each(function () {
                $(document).unbind('mouseup.highlighter');
                $(this).unbind('mouseup.highlighter');
                $(this).unbind('tripleclick.highlighter');
                $(this).unbind('dblclick.highlighter');
                $(this).unbind('mousedown.highlighter');
            });
        }
    };

    /*
     * Method calling logic taken from the
     * jQuery article on best practices for
     * plugins.
     *
     * http://docs.jquery.com/Plugins/Authoring
     */
    $.fn.highlighter = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.highlighter');
        }

    };

})(jQuery);

StudyGroupsApp.directive('highlighter', function(){
  return {
    scope: {
      highlightContent: '=',
      currentlyHighlightedSection: '=',
      highlightedSections: '=',
      displayedTypes: '='
    },
    link: function(scope, elem, attrs){
      function highlighter(text, words){
      	  var highlightBuilder = '';
          var textPointer = 0;
          var wordsPointer = 0;
          var startPoint = 0;

          while(textPointer < text.length){
          	var nextChar = text[textPointer];

              while(nextChar == '<' && textPointer < text.length){
              	textPointer = text.indexOf('>', textPointer) + 1;
                nextChar = text[textPointer];
              }

              if(nextChar == words[wordsPointer]){
              	if(wordsPointer == 0){
                  	startPoint = textPointer;
                  }

                  highlightBuilder += nextChar;
                  wordsPointer++;
              }else{
              	highlightBuilder = '';
                  wordsPointer = 0;
              }

              textPointer++;

              if(highlightBuilder == words){
              	break;
              }
          }

          return { start: startPoint, end: textPointer }
      }

      function highlight(){
        if(!scope.highlightedSections){
          return;
        }

        $(elem).find('.highlighted-text').contents().unwrap();

        scope.highlightedSections.forEach(function(section){
          if(scope.displayedTypes.indexOf(section.type) >= 0){
            var currentContent = $(elem).html();
            var bounds = highlighter(currentContent, section.text);

            elem.html(currentContent.substring(0, bounds.start) + '<u class="highlighted-text ' + 'bg-' + section.type + '">' + currentContent.substring(bounds.start, bounds.end) + '</u>' + currentContent.substring(bounds.end, currentContent.length));
          }
        });
      }

      scope.$watch('displayedTypes', function(types){
        highlight();
      }, true);

      scope.$watch('highlightedSections', function(sections){
        if($(elem).html()){
          highlight();
        }
      }, true);

      scope.$watch('highlightContent', function(content){
        if(content){
          highlight();

          $(elem).highlighter({
            minWords: 3,
            complete: function(data){
              scope.$apply(function(){ scope.currentlyHighlightedSection = data });
            }
          });
        }
      });
    }
  }
});
