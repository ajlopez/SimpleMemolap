
'use strict';

var simplememolap = (function () {
    function Dimension(name) {
        this.name = name;
        this.values = [];
    }

    Dimension.prototype.getValue = function (value) {
        var index = this.values.indexOf(value);

        if (index >= 0)
            return this.values[index];

        this.values.push(value);
        return value;
    }

    function Engine() {
        var dimensions = [];
        var tuples = [];

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

        this.addTuple = function (obj) {
            var tuple = { };

            for (var n in obj) {
                var dimension = dimensions[n];
                if (!dimension)
                    continue;
                tuple[n] = dimension.getValue(obj[n]);                
            }

            tuples.push(tuple);

            return tuple;
        }

        this.forEachTuple = function (filter, fn) {
            if (fn === undefined) {
                fn = filter;
                filter = undefined;
            }
                    
            if (!filter)
                tuples.forEach(fn);
            else
                tuples.forEach(function (tuple) { if (filter(tuple)) fn(tuple); });
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
