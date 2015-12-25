
var sm = require('../');

var engine = sm.createEngine();

// Dimensions

var dimcountry = engine.createDimension('country');
var dimcategory = engine.createDimension('category');
var dimproduct = engine.createDimension('product');

var dimensions = engine.getDimensions();

function generateTuples(ncountries, ncategories, nproducts) {
    var engine = sm.createEngine();

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

exports['generate and count 1000 tuples'] = function (test) {
    var engine = generateTuples(10, 10, 10);
    var count = 0;

    engine.forEachTuple(function (tuple) { count ++; });
    test.equal(count, 1000);
};

exports['generate and count 100000 tuples'] = function (test) {
    var engine = generateTuples(100, 10, 100);
    var count = 0;

    engine.forEachTuple(function (tuple) { count ++; });
    test.equal(count, 100000);
};

exports['generate and count 500000 tuples'] = function (test) {
    var engine = generateTuples(100, 50, 100);
    var count = 0;

    engine.forEachTuple(function (tuple) { count ++; });
    test.equal(count, 500000);

    var dimensions = engine.getDimensions();

    test.ok(dimensions);
    test.ok(dimensions.country);
    test.ok(dimensions.country.values);
    test.equal(dimensions.country.values.length, 100);
    test.ok(dimensions.category);
    test.ok(dimensions.category.values);
    test.equal(dimensions.category.values.length, 50);
    test.ok(dimensions.product);
    test.ok(dimensions.product.values);
    test.equal(dimensions.product.values.length, 100);
};

exports['count country 1 tuples'] = function (test) {
    var engine = generateTuples(100, 50, 100);

    var count = 0;

    engine.forEachTuple(
        function (tuple) { return tuple.country === 'Country 1'; },
        function (tuple) { count++; }
    );

    test.equal(count, 5000);
};

exports['count country 1 tuples by category'] = function (test) {
    var engine = generateTuples(100, 50, 100);

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
        test.equal(map[name], 100);
        count++;
    }

    test.equal(count, 50);
};
