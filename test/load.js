
var sm = require('../');

var dataset = sm.dataset();

// Dimensions

var dimcountry = dataset.dimension('country');
var dimcategory = dataset.dimension('category');
var dimproduct = dataset.dimension('product');

var dimensions = dataset.dimensions();

function generateTuples(ncountries, ncategories, nproducts) {
    var dataset = sm.dataset();

    // Dimensions

    dataset.dimension('country');
    dataset.dimension('category');
    dataset.dimension('product');

    for (var k = 1; k <= ncountries; k++) {
        var obj = { country: 'Country ' + k };
        for (var j = 1; j <= ncategories; j++) {
            obj.category = 'Category ' + j;
            for (var i = 1; i <= nproducts; i++) {
                obj.product = 'Product ' + i;
                dataset.add(obj, 1);
            }
        }
    }

    return dataset;
}

exports['generate 1000 tuples'] = function (test) {
    var dataset = generateTuples(10, 10, 10);
    test.equal(dataset.size(), 1000);
};

exports['generate 100000 tuples'] = function (test) {
    var dataset = generateTuples(100, 10, 100);
    test.equal(dataset.size(), 100000);
};

exports['generate and retrieve 500000 tuples'] = function (test) {
    var dataset = generateTuples(100, 50, 100);
    test.equal(dataset.size(), 500000);

    var dimensions = dataset.dimensions();

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
    
    var tuples = dataset.tuples();
    
    var count = 0;
    var ccount = 0;
    var tuple;
    
    while ((tuple = tuples.next()) != null) {
        count++;

        if (tuple.array[tuple.offset] === 1)
            ccount++;
    }
    
    test.equal(count, 500000);
    test.equal(ccount, 5000);
};

exports['count tuples'] = function (test) {
    var dataset = generateTuples(10, 10, 10);

    test.equal(dataset.tuples().count(), 1000);
};

exports['retrieve country 1 tuples'] = function (test) {
    var dataset = generateTuples(100, 50, 100);

    var tuples = dataset.tuples();
    var ccount = 0;
    var tuple;
    
    while ((tuple = tuples.next()) != null) {
        count++;

        if (tuple.array[tuple.offset] === 1)
            ccount++;
    }
    
    test.equal(ccount, 5000);
    
    var count = dataset.tuples().where({ country: 'Country 1' }).count();

    test.equal(count, 5000);
};

