
var simplememolap = require('../'),
    assert = require('assert');

var engine = simplememolap.createEngine();

// Dimensions

var dimcountry = engine.createDimension('country');
var dimcategory = engine.createDimension('category');
var dimproduct = engine.createDimension('product');

var dimensions = engine.getDimensions();

function generateTuples(ncountries, ncategories, nproducts) {
    var engine = simplememolap.createEngine();

    // Dimensions

    engine.createDimension('country');
    engine.createDimension('category');
    engine.createDimension('product');

    for (var k = 1; k <= ncountries; k++) {
        var obj = { country: 'Country ' + k };
        for (var j = 1; j <= ncategories; j++) {
            obj.category = 'Category ' + j;
            for (var i = 1; i <= nproducts; i++) {
                obj.product = 'Product ' + i;
                engine.addTuple(obj);
            }
        }
    }

    return engine;
}

// Generate and count 1000 tuples

var engine = generateTuples(10, 10, 10);
var count = 0;

engine.forEachTuple(function (tuple) { count ++; });
assert.equal(count, 1000);

// Generate and count 100000 tuples

var engine = generateTuples(100, 10, 100);
var count = 0;

engine.forEachTuple(function (tuple) { count ++; });
assert.equal(count, 100000);

// Generate and count 500000 tuples

var engine = generateTuples(100, 50, 100);
var count = 0;

engine.forEachTuple(function (tuple) { count ++; });
assert.equal(count, 500000);

var dimensions = engine.getDimensions();
assert.ok(dimensions);
assert.ok(dimensions.country);
assert.ok(dimensions.country.values);
assert.equal(dimensions.country.values.length, 100);
assert.ok(dimensions.category);
assert.ok(dimensions.category.values);
assert.equal(dimensions.category.values.length, 50);
assert.ok(dimensions.product);
assert.ok(dimensions.product.values);
assert.equal(dimensions.product.values.length, 100);

// Count Country 1 tuples

var count = 0;

engine.forEachTuple(
    function (tuple) { return tuple.country === 'Country 1'; },
    function (tuple) { count++; }
);

assert.equal(count, 5000);

// Count Country 1 tuples by Category

var map = [];

engine.forEachTuple(
    function (tuple) { return tuple.country === 'Country 1'; },
    function (tuple) {
        var category = tuple.category;
        if (!category)
            return;
        if (!map[category])
            map[category] = 0;
        map[category]++;
    }
);

var count = 0;

for (var name in map) {
    assert.equal(map[name], 100);
    count++;
}

assert.equal(count, 50);
