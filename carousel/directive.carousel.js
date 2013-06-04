(function(module) {
    module.directive('carousel', function($parse) {
        var PANE_CLASS = ".ui-carousel-pane";


        /**
         * easeing methods
         * @param f
         * @param a
         * @param h
         * @param g
         * @returns {number}
         */
        var easeIn = function (f, a, h, g) {
            return h * (f /= g) * f + a
        };

        var easeOut = function (f, a, h, g) {
            return -h * (f /= g) * (f - 2) + a
        };


        /**
         * navigate to a pane
         * @param element
         * @param show_index
         * @param current_index
         * @param animate
         * @returns {number}
         */
        function setCurrentPane(element, show_index, current_index, animate) {
            var panes = element.find(PANE_CLASS),
                index = 0,
                pane,
                classNames, newClassName;

            // animate?
            if(typeof(animate) == 'undefined') {
                animate = true;
            }

            // ensure the index exists
            show_index = Math.min(panes.length-1, Math.max(0, show_index));

            while(index<panes.length) {
                pane = panes[index];

                classNames = [
                    "animate",
                    (animate && (index == current_index || index == show_index)) ? "" : "static",
                    (show_index == index) ? "show" : "hide",
                    (show_index > index) ? "slide-left" : "slide-right"
                ];

                // replace classNames with new classNames
                newClassName = pane.className.replace(/ (slide-[a-z]+|hide|show|animate|static)/g, "");
                pane.className = (newClassName +" "+ classNames.join(" ")).replace(/\s+/g, " ");

                index++;
            }

            return show_index;
        }


        /**
         * find pane element
         * @param element
         * @param index
         * @returns {*|jQuery|HTMLElement}
         */
        function getPaneElement(element, index) {
            return $(element.find(PANE_CLASS)[index])
        }



        return function(scope, element, attrs) {
            var current = 0,
                first = true,
                before_change_cb = scope[attrs.uiCarousel],
                active_handlers = {};

            function toPane(index, animate, ev) {
                if((before_change_cb && before_change_cb(current, index, ev)) || !before_change_cb) {
                    current = setCurrentPane(element, index, current, animate);

                    // active handlers
                    if(active_handlers[index]) {
                        active_handlers[index].forEach(function(handler) {
                            handler();
                        });
                    }
                }
            }

            // initial
            toPane(0, false);

            // add navigation methods to the scope
            scope.nextPane = function(animate, ev) { toPane(current+1, animate, ev); };
            scope.prevPane = function(animate, ev) { toPane(current-1, animate, ev); };
            scope.toPane = toPane;


            // get current pane index
            // or check if it is the current
            scope.currentPane = function(index) {
                if(typeof(index) == 'undefined') {
                    return current;
                }
                else {
                    return index == current;
                }
            };


            // callback when become active
            scope.onPaneActive = function(index, handler) {
                active_handlers[index] = active_handlers[index] || [];
                active_handlers[index].push(handler);
            };


            // swipe thru the panes
            element.on("swipe", function(ev) {
                if(Math.abs(ev.gesture.distance) < 10) {
                    return;
                }
                switch(ev.gesture.direction) {
                    case Hammer.DIRECTION_LEFT:
                        scope.nextPane(true, ev);
                        break;

                    case Hammer.DIRECTION_RIGHT:
                        scope.prevPane(true, ev);
                        break;
                }

                if(!scope.$$phase) {
                    scope.$apply();
                }
            });


            // tab thru input fields
            element.on("focus", ":input", function(ev) {
                toPane($(this).closest(PANE_CLASS).index());
                ev.preventDefault();

                // focus causes scrollLeft to change
                setTimeout(function() {
                    element[0].scrollLeft = 0;
                }, 0);
            });

        };
    });

})(angular.module('UI'));