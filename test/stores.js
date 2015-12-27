
var stores = require('../lib/stores');

var store;

exports['create store'] = function (test) {
    var store = stores.store({ dimensions: 3 });
    
    test.ok(store);
    test.equal(typeof store, 'object');
    test.equal(store.dimensions(), 3);
    test.equal(store.size(), 0);
};

exports['create store without dimensions raise an exception'] = function (test) {
    test.throws(
        function () {
            stores.store();
        },
        "Number of dimensions is required to create a store"
    );
};

exports['add values and data'] = function (test) {
    store = stores.store({ dimensions: 3 });
    store.add([1, 2, 3], "foo");
    
    test.equal(store.size(), 1);
};


