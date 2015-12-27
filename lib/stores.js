
function Store(options) {
    options = options || {};
    
    var size = 0;
    
    if (!options.dimensions)
        throw new Error("Number of dimensions is required to create a store");
    
    this.dimensions = function () {
        return options.dimensions;
    };
    
    this.size = function () {
        return size;
    };
    
    this.add = function (values, data) {
        size++;
    };
}

function createStore(options) {
    return new Store(options);
}

module.exports = {
    store: createStore
};