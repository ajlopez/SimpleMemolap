
var sm = require('../'),
    assert = require('assert');

var engine;

exports["createEngine defined"] = function (test) {
    assert.ok(sm.createEngine);
    assert.equal(typeof sm.createEngine, 'function');
};

exports["create engine"] = function (test) {
    engine = sm.createEngine();
    assert.ok(engine);
};

exports["dimensions"] = function (test) {
    var dimcountry = engine.createDimension('country');
    test.ok(dimcountry);
    test.equal(dimcountry.name, 'country');

    var dimcategory = engine.createDimension('category');
    test.ok(dimcategory);
    test.equal(dimcategory.name, 'category');

    var dimproduct = engine.createDimension('product');
    test.ok(dimproduct);
    test.equal(dimproduct.name, 'product');
};

exports["get dimensions"] = function (test) {
    var dimensions = engine.getDimensions();
    test.ok(dimensions);
    test.ok(dimensions.country);
    test.ok(dimensions.category);
    test.ok(dimensions.product);
    test.equal(engine.getDimension('country'), dimensions.country);
    test.equal(engine.getDimension('category'), dimensions.category);
    test.equal(engine.getDimension('product'), dimensions.product);
};


