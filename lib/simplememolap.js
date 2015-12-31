
'use strict';

var stores = require('./stores');

var simplememolap = (function () {
    function getDimensionOffset(name, dimensions) {
        for (var k = 0; k < dimensions.length; k++)
            if (dimensions[k].name == name)
                return k;
            
        return -1;
    }
    
    function toArray(cursor, dimensions) {
        var result = [];
        var ndimensions = dimensions.length;
        
        for (var tuple = cursor.next(); tuple; tuple = cursor.next()) {
            var obj = { };
            
            for (var k = 0; k < ndimensions; k++)
                obj[dimensions[k].name] = dimensions[k].values[tuple.array[tuple.offset + k]];
            
            obj.$data = tuple.data;
            
            result.push(obj);
        }
        
        return result;
    }
    
    function FilterCursor(dataset, cursor, filter) {
        var dimensions = dataset.dimensions();
        var fdimensions = [];
        var fvalues = [];
        
        for (var name in filter) {
            var ndim = getDimensionOffset(name, dimensions);
            var nvalue = dimensions[ndim].getValue(filter[name]);

            fdimensions.push(ndim);
            fvalues.push(nvalue);
        }
        
        var flength = fdimensions.length;
        
        this.next = function () {            
            while (true) {
                var tuple = cursor.next();
                
                if (tuple == null)
                    return null;
                
                if (match(tuple))
                    return tuple;
            }
            
            return null;
        }
        
        this.count = function () {
            var count = 0;
            
            while (this.next() != null)
                count++;
            
            return count;
        }
        
        function match(tuple) {
            for (var k = 0; k < flength; k++) 
                if (tuple.array[tuple.offset + fdimensions[k]] !== fvalues[k])
                    return false;
            
            return true;
        }
    }
    
    function DatasetCursor(dataset) {
        var position = 0;
        var size = dataset.size();
        var tuple = {};
        
        this.count = function () { return size; }
        
        this.where = function (filter) { return new FilterCursor(dataset, this, filter); }
        
        this.next = function () {
            if (position >= size)
                return null;
            
            dataset.tuple(position++, tuple);
            
            return tuple;
        }
        
        this.toArray = function () { return toArray(this, dataset.dimensions()); };
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

    function Dataset() {
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

        this.add = function (values) {
            var tuple = Array(dimensions.length);
            var data = values.$data;
            
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
            return new DatasetCursor(this);
        }
    }

    function tupleContains(tuple, obj) {
        for (var n in obj)
            if (tuple[n] !== -obj[n])
                return false;

        return true;
    }

    function createDataset () {
        return new Dataset();
    }

    return {
        dataset: createDataset
    }
})();

if (typeof window === 'undefined') {
	module.exports = simplememolap;
}
