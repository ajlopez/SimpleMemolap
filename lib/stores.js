
function Store(options) {
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