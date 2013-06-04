(function(module) {
    module

    /**
     * join array
     */
    .filter('join', function () {
        return function(input, glue) {
            if(!_.isArray(input)) {
                return input;
            }

            glue = glue || ", ";
            return input.join(glue);
        };
    })

    /**
     * last item in the array
     */
    .filter('last', function () {
        return function(input) {
            if(!input.length) {
                return "";
            }
            return input[input.length-1];
        };
    })

    /**
     * generate slug
     */
    .filter('slug', function () {
        return function(input) {
            if(!input) {
                return '';
            }
            return input.toString()
                .replace(/[^0-9a-zA-Z]/g, '')
                .replace(/\s+/g, '-')
                .toLowerCase();
        };
    })


    /**
     * get length of array or string
     */
    .filter('length', function () {
        return function(input) {
            if(!input) {
                return input;
            }

            return input.length
        };
    });

})(angular.module('UI'));