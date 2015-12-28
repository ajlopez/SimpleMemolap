
'use strict';

var stores = require('./stores');

var simplememolap = (function () {
    function getDimensionOffset(name, dimensions) {
        for (var k = 0; k < dimensions.length; k++)
            if (dimensions[k].name == name)
                return k;
            
        return -1;
    }
    
    function FilterCursor(engine, cursor, filter) {
        var dimensions = engine.dimensions();
        var tfilter = [];
        
        for (var name in filter) {
            var ndim = getDimensionOffset(name, dimensions);
            var nvalue = dimensions[ndim].getValue(filter[name]);
            
            tfilter[ndim] = nvalue;
        }
        
        this.next = function () {
            while (true) {
                var tuple = cursor.next();
                
                if (tuple == null)
                    return null;
                
                if (match(tuple))
                    return tuple;
            }
        }
        
        this.count = function () {
            var count = 0;
            
            while (this.next() != null)
                count++;
            
            return count;
        }
        
        function match(tuple) {
            for (var ndim in tfilter) 
                if (tuple.array[tuple.offset + ndim] != tfilter[ndim])
                    return false;
            
            return true;
        }
    }
    
    function EngineCursor(engine) {
        var position = 0;
        var size = engine.size();
        var tuple = {};
        
        this.count = function () { return size; }
        
        this.where = function (filter) { return new FilterCursor(engine, this, filter); }
        
        this.next = function () {
            if (position >= size)
                return null;
            
            engine.tuple(position++, tuple);
            
            return tuple;
        }
    }
    
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
        
        this.tuple = function (n, tuple) { store.info(n, tuple); }
        
        this.size = function () {
            if (store == null)
                return 0;
            
            return store.size();
        }

        this.tuples = function () {
            return new EngineCursor(this);
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
