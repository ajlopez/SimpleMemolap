
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
                if (n === 'data') {
                    tuple.data = obj.data;
                    continue;
                }
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
            else if (typeof filter === 'object')
                tuples.forEach(function (tuple) { if (tupleContains(tuple, filter)) fn(tuple); });
            else
                tuples.forEach(function (tuple) { if (filter(tuple)) fn(tuple); });
        }
    }

    function tupleContains(tuple, obj) {
        for (var n in obj)
            if (tuple[n] !== obj[n])
                return false;

        return true;
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
