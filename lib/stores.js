
function Store(options) {
    options = options || {};
    
    if (!options.dimensions)
        throw new Error("Number of dimensions is required to create a store");
    
    this.dimensions = function () {
        return options.dimensions;
    };
    
    this.size = function () {
        return 0;
    };
}

function createStore(options) {
    return new Store(options);
}

module.exports = {
    store: createStore
};