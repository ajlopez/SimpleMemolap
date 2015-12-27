
var stores = require('../lib/stores');

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

