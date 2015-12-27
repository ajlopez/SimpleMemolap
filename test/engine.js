
var sm = require('../');

var engine;

exports["engine factory defined"] = function (test) {
    test.ok(sm.engine);
    test.equal(typeof sm.engine, 'function');
};

exports["create engine"] = function (test) {
    engine = sm.engine();
    test.ok(engine);
};

exports["dimensions"] = function (test) {
    var dimcountry = engine.dimension('country');
    test.ok(dimcountry);
    test.equal(dimcountry.name, 'country');

    var dimcategory = engine.dimension('category');
    test.ok(dimcategory);
    test.equal(dimcategory.name, 'category');

    var dimproduct = engine.dimension('product');
    test.ok(dimproduct);
    test.equal(dimproduct.name, 'product');
};

exports["get dimensions"] = function (test) {
    var dimensions = engine.dimensions();
    test.ok(dimensions);
    test.ok(Array.isArray(dimensions));
    test.equal(dimensions.length, 3);
    test.equal(engine.dimension('country'), dimensions[0]);
    test.equal(engine.dimension('category'), dimensions[1]);
    test.equal(engine.dimension('product'), dimensions[2]);
};


