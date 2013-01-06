
var simplememolap = require('../'),
    assert = require('assert');

// createEngine defined

assert.ok(simplememolap.createEngine);
assert.equal(typeof simplememolap.createEngine, 'function');

// Create engine

var engine = simplememolap.createEngine();
assert.ok(engine);

// Dimensions

var dimcountry = engine.createDimension('country');
assert.ok(dimcountry);
assert.equal(dimcountry.name, 'country');

var dimcategory = engine.createDimension('category');
assert.ok(dimcategory);
assert.equal(dimcategory.name, 'category');

var dimproduct = engine.createDimension('product');
assert.ok(dimproduct);
assert.equal(dimproduct.name, 'product');

var dimensions = engine.getDimensions();
assert.ok(dimensions);
assert.ok(dimensions.country);
assert.ok(dimensions.category);
assert.ok(dimensions.product);

assert.equal(engine.getDimension('country'), dimensions.country);
assert.equal(engine.getDimension('category'), dimensions.category);
assert.equal(engine.getDimension('product'), dimensions.product);

