
function Store(options) {
    options = options || {};
    
    var size = 0;
    var avalues = [];
    var adata = [];
    
    if (!options.dimensions)
        throw new Error("Number of dimensions is required to create a store");
    
    this.dimensions = function () {
        return options.dimensions;
    };
    
    this.size = function () {
        return size;
    };
    
    this.add = function (values, data) {
        for (var n = 0; n < options.dimensions; n++)
            avalues.push(values[n]);
            
        adata.push(data);
        size++;
    };
    
    this.info = function (n, info) {
        info.array = avalues;
        info.offset = n * options.dimensions;
        info.data = adata[n];
    };
}

function createStore(options) {
    return new Store(options);
}

module.exports = {
    store: createStore
};