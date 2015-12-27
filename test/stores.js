
var stores = require('../lib/stores');

exports['create store'] = function (test) {
    var store = stores.store({ dimensions: 3 });
    
    test.ok(store);
    test.equal(typeof store, 'object');
    test.equal(store.dimensions(), 3);
    test.equal(store.size(), 0);
};

