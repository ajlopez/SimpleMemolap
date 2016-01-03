
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
    
    function toTupleArray(cursor, ndimensions) {
        var result = [];

        for (var tuple = cursor.next(); tuple; tuple = cursor.next())
            result.push({ array: tuple.array, offset: tuple.offset, data: tuple.data });

        return result;
    }
    
    function BaseCursor() {        
    }
    
    BaseCursor.prototype.count = function () {
        var count = 0;
        
        while (this.next() != null)
            count++;
        
        return count;        
    }
    
    BaseCursor.prototype.toArray = function () {
        var dimensions = this.dimensions();
        var result = [];
        var ndimensions = dimensions.length;
        
        for (var tuple = this.next(); tuple; tuple = this.next()) {
            var obj = { };
            
            for (var k = 0; k < ndimensions; k++)
                obj[dimensions[k].name] = dimensions[k].values[tuple.array[tuple.offset + k]];
            
            obj.$data = tuple.data;
            
            result.push(obj);
        }
        
        return result;
    }
    
    BaseCursor.prototype.toTupleArray = function () {
        var result = [];

        for (var tuple = this.next(); tuple; tuple = this.next())
            result.push({ array: tuple.array, offset: tuple.offset, data: tuple.data });

        return result;
    }
    
    BaseCursor.prototype.where = function (filter) { 
        return new FilterCursor(this, filter); 
    };
        
    BaseCursor.prototype.sort = function (fields) { 
        return new SortCursor(this, fields); 
    }

    function SortCursor(cursor, fields, options) {
        var self = this;
        var dimensions = cursor.dimensions();
        var ndimensions = dimensions.length;
        
        if (!Array.isArray(fields))
            fields = [fields];
        
        var nfields = fields.length;
        var dimoffsets = new Array(nfields);
        var dimvals = new Array(nfields);
        
        for (var k = 0; k < nfields; k++) {
            dimoffsets[k] = getDimensionOffset(fields[k], dimensions);
            var dimvalues = dimensions[dimoffsets[k]].values;
            
            var sortedvalues = dimvalues.slice(1);
            sortedvalues.sort();
            
            var valorders = new Array(dimvalues.length);
            
            valorders[0] = 0;
            
            for (var n = 0; n < sortedvalues.length; n++)
                valorders[dimvalues.indexOf(sortedvalues[n])] = n + 1;
            
            dimvals[k] = valorders;
        }
        
        var newtuples = null;
        var nnewtuples = 0;
        var position = 0;
        
        this.next = function () {
            if (newtuples == null)
                sort();

            if (position >= nnewtuples)
                return null;
            
            return newtuples[position++];
        }
        
        this.dimensions = function () { return dimensions; };
        
        function sort() {
            newtuples = cursor.toTupleArray();
            
            newtuples.sort(comparer);
            
            nnewtuples = newtuples.length;
        }
        
        function comparer(a, b) {
            for (var k = 0; k < nfields; k++) {
                var vala = dimvals[k][a.array[a.offset + dimoffsets[k]]];
                var valb = dimvals[k][b.array[b.offset + dimoffsets[k]]];
                
                if (vala < valb)
                    return -1;
                
                if (vala > valb)
                    return 1;
            }
            
            return 0;
        }
    }
    
    SortCursor.prototype.__proto__ = BaseCursor.prototype;
    
    function FilterCursor(cursor, filter) {
        var dimensions = cursor.dimensions();
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
        
        this.toArray = function () { return toArray(this, dimensions); };
        
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
        
        this.dimensions = function () { return dataset.dimensions(); };
        
        this.count = function () { return size; };
        
        this.next = function () {
            if (position >= size)
                return null;
            
            dataset.tuple(position++, tuple);
            
            return tuple;
        }
    }
    
    DatasetCursor.prototype.__proto__ = BaseCursor.prototype;
    
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

    function Dataset(options) {
        options = options || {};
        var dimensions = options.dimensions || [];
        var dimensionsmap = {};
        var store = null;
        
        if (dimensions.length) {
            store = stores.store({ dimensions: dimensions.length });
            
            dimensions.forEach(function (dimension) {
                dimensionsmap[dimension.name] = dimension;
            });
            
            if (options.tuples)
                options.tuples.forEach(function (tuple) {
                    var values = new Array(dimensions.length);
                    
                    for (var nv = 0; nv < dimensions.length; nv++)
                        values[nv] = tuple.array[tuple.offset + nv];
                    
                    store.add(values, tuple.data);
                })
        }

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
