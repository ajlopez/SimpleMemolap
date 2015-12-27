
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
                engine.addTuple(obj, 1);
            }
        }
    }

    return engine;
}

exports['generate 1000 tuples'] = function (test) {
    var engine = generateTuples(10, 10, 10);
    test.equal(engine.getSize(), 1000);
};

exports['generate 100000 tuples'] = function (test) {
    var engine = generateTuples(100, 10, 100);
    test.equal(engine.getSize(), 100000);
};

exports['generate and count 500000 tuples'] = function (test) {
    var engine = generateTuples(100, 50, 100);
    test.equal(engine.getSize(), 500000);

    engine.forEachTuple(function (tuple) { count ++; });
    test.equal(count, 500000);

    var dimensions = engine.getDimensions();

    test.ok(dimensions);
    test.ok(dimensions[0]);
    test.ok(dimensions[0].values);
    test.equal(dimensions[0].values.length, 101);
    test.ok(dimensions[1]);
    test.ok(dimensions[1].values);
    test.equal(dimensions[1].values.length, 51);
    test.ok(dimensions[2]);
    test.ok(dimensions[2].values);
    test.equal(dimensions[2].values.length, 101);
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
