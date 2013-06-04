(function(module) {

    $(document.body)
        // hide ios keyboard on tap on something that isnt a input
        .on("touchstart", function(ev) {
            if(!$(ev.target).closest(":input").length) {
                document.activeElement.blur();
            }
        })
        // disable dragging of images on a desktop
        .on("dragstart", "img", function(ev) {
            ev.preventDefault();
        });


    // touch magic..!
    new FastClick(document.body);

    new Hammer(document.body, {
        drag_min_distance: 0,
        swipe_velocity: 0.85,
        drag_max_touches: 0
    });


    // gesture events
    var prefix = 'hm',
        gestures = ['Hold', 'Tap', 'Doubletap',
            'Drag', 'Dragup', 'Dragdown', 'Dragleft', 'Dragright',
            'Swipe', 'Swipeup', 'Swipedown', 'Swipeleft', 'Swiperight',
            'Transform', 'Rotate', 'Pinch', 'Pinchin', 'Pinchout',
            'Touch', 'Release'];

    gestures.forEach(function(name) {
        module.directive(prefix + name, function($parse) {
            return function(scope, element, attr) {

                var fn = $parse(attr[prefix + name]);
                element.bind(name.toLowerCase(), function(ev) {
                    if(ev.isPropagationStopped()) {
                        return;
                    }
                    scope.$apply(function() {
                        fn(scope, {$event:ev});
                    });
                });
            };
        });
    });

})(angular.module('UI'));