
'use strict';

var stores = require('./stores');

var simplememolap = (function () {
    function Dimension(name) {
        this.name = name;
        this.values = [ null ];
    }

    Dimension.prototype.getValue = function (value) {
        if (value == null)
            return 0;
        
        var index = this.values.indexOf(value);

        if (index >= 0)
            return index;

        this.values.push(value);
        return this.values.length - 1;
    }

    function Engine() {
        var dimensions = [];
        var dimensionsmap = {};
        var store = null;

        this.dimension = function (name) {
            if (dimensionsmap[name])
                return dimensionsmap[name];
            var dimension = new Dimension(name);
            dimensions.push(dimension);
            dimensionsmap[name] = dimension;
            return dimension;
        }

        this.dimensions = function () {
            return dimensions;
        }

        this.add = function (values, data) {
            var tuple = Array(dimensions.length);

            for (var k = 0; k < dimensions.length; k++) {
                var name = dimensions[k].name;
                var value = values[name];
                
                if (value == null)
                    tuple[k] = 0;
                else
                    tuple[k] = dimensions[k].getValue(value);
            }
            
            if (store == null)
                store = stores.store({ dimensions: dimensions.length });
            
            store.add(tuple, data);
        }
        
        this.size = function () {
            if (store == null)
                return 0;
            
            return store.size();
        }

        this.forEachTuple = function (filter, fn) {
            if (fn == null) {
                fn = filter;
                filter = null;
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
        engine: createEngine
    }
})();

if (typeof window === 'undefined') {
	module.exports = simplememolap;
}
