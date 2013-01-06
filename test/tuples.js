
var simplememolap = require('../'),
    assert = require('assert');

var engine = simplememolap.createEngine();

// Dimensions

var dimcountry = engine.createDimension('country');
var dimcategory = engine.createDimension('category');
var dimproduct = engine.createDimension('product');

var dimensions = engine.getDimensions();

// Add tuple

var tuple = engine.addTuple({ country: 'Argentina', category: 'Beverages', product: 'Beer' });
assert.ok(tuple);
assert.ok(tuple.country);
assert.ok(tuple.category);
assert.ok(tuple.product);

var tuple = engine.addTuple({ country: 'Argentina', category: 'Beverages', product: 'Coffee' });
assert.ok(tuple);
assert.ok(tuple.country);
assert.ok(tuple.category);
assert.ok(tuple.product);

var tuple = engine.addTuple({ country: 'Chile', category: 'Beverages', product: 'Coke', notadimension: 123 });
assert.ok(tuple);
assert.ok(tuple.country);
assert.ok(tuple.category);
assert.ok(tuple.product);
assert.equal(tuple.notadimension, undefined);

assert.ok(dimensions.country.values);
assert.ok(dimensions.category.values);
assert.ok(dimensions.product.values);

assert.equal(dimensions.country.values.length, 2);
assert.ok(dimensions.country.values.indexOf('Argentina') >= 0);
assert.ok(dimensions.country.values.indexOf('Chile') >= 0);

assert.equal(dimensions.category.values.length, 1);
assert.ok(dimensions.category.values.indexOf('Beverages') >= 0);

assert.equal(dimensions.product.values.length, 3);
assert.ok(dimensions.product.values.indexOf('Beer') >= 0);
assert.ok(dimensions.product.values.indexOf('Coffee') >= 0);
assert.ok(dimensions.product.values.indexOf('Coke') >= 0);

// for each tuple

var count = 0;

engine.forEachTuple(function (tuple) { count ++; });
assert.equal(count, 3);

// for each with filter

var count = 0;
engine.forEachTuple(function (tuple) { return tuple.country === 'Argentina'; }, function (tuple) { count ++; });
assert.equal(count, 2);

// for each with tuple filter by example

var count = 0;
engine.forEachTuple({ country: 'Argentina' }, function (tuple) { count ++; });
assert.equal(count, 2);

var count = 0;
engine.forEachTuple({ category: 'Beverages' }, function (tuple) { count ++; });
assert.equal(count, 3);

var count = 0;
engine.forEachTuple({ country: 'Chile', category: 'Beverages' }, function (tuple) { count ++; });
assert.equal(count, 1);
