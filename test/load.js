
var sm = require('../');

var engine = sm.engine();

// Dimensions

var dimcountry = engine.dimension('country');
var dimcategory = engine.dimension('category');
var dimproduct = engine.dimension('product');

var dimensions = engine.dimensions();

function generateTuples(ncountries, ncategories, nproducts) {
    var engine = sm.engine();

    // Dimensions

    engine.dimension('country');
    engine.dimension('category');
    engine.dimension('product');

    for (var k = 1; k <= ncountries; k++) {
        var obj = { country: 'Country ' + k };
        for (var j = 1; j <= ncategories; j++) {
            obj.category = 'Category ' + j;
            for (var i = 1; i <= nproducts; i++) {
                obj.product = 'Product ' + i;
                engine.add(obj, 1);
            }
        }
    }

    return engine;
}

exports['generate 1000 tuples'] = function (test) {
    var engine = generateTuples(10, 10, 10);
    test.equal(engine.size(), 1000);
};

exports['generate 100000 tuples'] = function (test) {
    var engine = generateTuples(100, 10, 100);
    test.equal(engine.size(), 100000);
};

exports['generate 500000 tuples'] = function (test) {
    var engine = generateTuples(100, 50, 100);
    test.equal(engine.size(), 500000);

    var dimensions = engine.dimensions();

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

exports['count tuples'] = function (test) {
    var engine = generateTuples(10, 10, 10);

    test.equal(engine.tuples().count(), 1000);
};

exports['retrieve country 1 tuples'] = function (test) {
    var engine = generateTuples(100, 50, 100);

    var count = engine.tuples().where({ country: 'Country 1' }).count();

    test.equal(count, 5000);
};

