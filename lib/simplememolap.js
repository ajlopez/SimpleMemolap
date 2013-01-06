
'use strict';

var simplememolap = (function () {
    function Dimension(name) {
        this.name = name;
    }

    function Engine() {
        var dimensions = [];

        this.createDimension = function (name) {
            if (dimensions[name])
                return dimensions[name];
            var dimension = new Dimension(name);
            dimensions[name] = dimension;
            return dimension;
        }

        this.getDimensions = function () {
            return dimensions;
        }

        this.getDimension = function (name) {
            return dimensions[name];
        }
    }

    function createEngine () {
        return new Engine();
    }

    return {
        createEngine: createEngine
    }
})();

if (typeof window === 'undefined') {
	module.exports = simplememolap;
}
