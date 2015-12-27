
var bpower = 10;
var bsize = 1 << bpower;
var brem = bsize - 1;

function Store(options) {
    options = options || {};
    
    var size = 0;
    var vblocks = [];
    var dblocks = [];
    
    if (!options.dimensions)
        throw new Error("Number of dimensions is required to create a store");
    
    this.dimensions = function () {
        return options.dimensions;
    };
    
    this.size = function () {
        return size;
    };
    
    function createDataBlock() {
        return Array(bsize);
    }
    
    function createValuesBlock() {
        var nelems = options.dimensions * bsize;
        var buffer = new ArrayBuffer(nelems * 2);
        return new Int16Array(buffer);
    }
    
    this.add = function (values, data) {
        var nblock = size >> bpower;
        var doffset = size & brem;
        var voffset = doffset * options.dimensions;
        
        if (!vblocks[nblock])
            vblocks[nblock] = createValuesBlock();
        if (!dblocks[nblock])
            dblocks[nblock] = createDataBlock();
            
        var varray = vblocks[nblock];
        var darray = dblocks[nblock];
        
        for (var n = 0; n < options.dimensions; n++)
            varray[voffset + n] = values[n];
        
        darray[doffset] = data;

        size++;
    };
    
    this.info = function (n, info) {
        var nblock = n >> bpower;
        var doffset = n & brem;
        var voffset = doffset * options.dimensions;
        
        info.array = vblocks[nblock];
        info.offset = voffset;
        info.data = dblocks[nblock][doffset];
    };
}

function createStore(options) {
    return new Store(options);
}

module.exports = {
    store: createStore
};