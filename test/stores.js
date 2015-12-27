
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

exports['retrieve values and data'] = function (test) {
    var info = {};
    
    store.info(0, info);
    test.ok(info.array);
    test.equal(info.offset, 0);
    test.equal(info.data, "foo");
    
    test.equal(info.array[0], 1);
    test.equal(info.array[1], 2);
    test.equal(info.array[2], 3);
};

exports['generates and retrieve 10000 sets of values and data'] = function (test) {
    store = stores.store({ dimensions: 3 });
    
    for (var k = 0; k < 10000; k++) {
        store.add([k, k+1, k+2], k);
        test.equal(store.size(), k + 1);
    }
    var info = {};

    for (var k = 0; k < 10000; k++) {
        store.info(k, info);
        test.ok(info.array);
        test.equal(info.data, k);
        test.equal(info.array[info.offset], k);
        test.equal(info.array[info.offset + 1], k + 1);
        test.equal(info.array[info.offset + 2], k + 2);
    }
};
