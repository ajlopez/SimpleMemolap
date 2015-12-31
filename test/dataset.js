
var sm = require('../');

var dataset;

exports["dataset factory defined"] = function (test) {
    test.ok(sm.dataset);
    test.equal(typeof sm.dataset, 'function');
};

exports["create dataset"] = function (test) {
    dataset = sm.dataset();
    test.ok(dataset);
};

exports["dimensions"] = function (test) {
    var dimcountry = dataset.dimension('country');
    test.ok(dimcountry);
    test.equal(dimcountry.name, 'country');

    var dimcategory = dataset.dimension('category');
    test.ok(dimcategory);
    test.equal(dimcategory.name, 'category');

    var dimproduct = dataset.dimension('product');
    test.ok(dimproduct);
    test.equal(dimproduct.name, 'product');
};

exports["get dimensions"] = function (test) {
    var dimensions = dataset.dimensions();
    test.ok(dimensions);
    test.ok(Array.isArray(dimensions));
    test.equal(dimensions.length, 3);
    test.equal(dataset.dimension('country'), dimensions[0]);
    test.equal(dataset.dimension('category'), dimensions[1]);
    test.equal(dataset.dimension('product'), dimensions[2]);
};


