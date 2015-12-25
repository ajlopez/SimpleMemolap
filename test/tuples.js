
var sm = require('../');

var engine = sm.createEngine();

// Dimensions

var dimcountry = engine.createDimension('country');
var dimcategory = engine.createDimension('category');
var dimproduct = engine.createDimension('product');

var dimensions = engine.getDimensions();

exports['add tuple'] = function (test) {
    var tuple = engine.addTuple({ country: 'Argentina', category: 'Beverages', product: 'Beer' });
    test.ok(tuple);
    test.ok(tuple.country);
    test.ok(tuple.category);
    test.ok(tuple.product);
};

exports['add another tuple'] = function (test) {
    var tuple = engine.addTuple({ country: 'Argentina', category: 'Beverages', product: 'Coffee', data: 100 });
    test.ok(tuple);
    test.ok(tuple.country);
    test.ok(tuple.category);
    test.ok(tuple.product);
    test.ok(tuple.data);
    test.equal(tuple.data, 100);
};

exports['add third tuple'] = function (test) {
    var tuple = engine.addTuple({ country: 'Chile', category: 'Beverages', product: 'Coke', notadimension: 123 });
    test.ok(tuple);
    test.ok(tuple.country);
    test.ok(tuple.category);
    test.ok(tuple.product);
    test.equal(tuple.notadimension, undefined);
};

exports['dimensions values'] = function (test) {
    test.ok(dimensions.country.values);
    test.ok(dimensions.category.values);
    test.ok(dimensions.product.values);

    test.equal(dimensions.country.values.length, 2);
    test.ok(dimensions.country.values.indexOf('Argentina') >= 0);
    test.ok(dimensions.country.values.indexOf('Chile') >= 0);

    test.equal(dimensions.category.values.length, 1);
    test.ok(dimensions.category.values.indexOf('Beverages') >= 0);

    test.equal(dimensions.product.values.length, 3);
    test.ok(dimensions.product.values.indexOf('Beer') >= 0);
    test.ok(dimensions.product.values.indexOf('Coffee') >= 0);
    test.ok(dimensions.product.values.indexOf('Coke') >= 0);
};

exports['for each tuple'] = function (test) {
    var count = 0;

    engine.forEachTuple(function (tuple) { count ++; });
    test.equal(count, 3);
};

exports['for each with filter'] = function (test) {
    var count = 0;
    engine.forEachTuple(function (tuple) { return tuple.country === 'Argentina'; }, function (tuple) { count ++; });
    test.equal(count, 2);
};

exports['for each with tuple filter by example'] = function (test) {
    var count = 0;
    engine.forEachTuple({ country: 'Argentina' }, function (tuple) { count ++; });
    test.equal(count, 2);

    var count = 0;
    engine.forEachTuple({ category: 'Beverages' }, function (tuple) { count ++; });
    test.equal(count, 3);

    var count = 0;
    engine.forEachTuple({ country: 'Chile', category: 'Beverages' }, function (tuple) { count ++; });
    test.equal(count, 1);
};

