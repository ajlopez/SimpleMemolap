
var sm = require('../');

var dataset = sm.dataset();

// Dimensions

var dimcountry = dataset.dimension('country');
var dimcategory = dataset.dimension('category');
var dimproduct = dataset.dimension('product');

var dimensions = dataset.dimensions();

exports['add tuple'] = function (test) {
    dataset.add({ country: 'Argentina', category: 'Beverages', product: 'Beer', $data: 100 });
    test.equal(dataset.size(), 1);
};

exports['retrieve tuple'] = function (test) {
    var row = { country: 'Argentina', category: 'Beverages', product: 'Beer', $data: 100 };
    
    var result = dataset.tuples().toArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.deepEqual(result[0], row);
};

exports['add another tuple'] = function (test) {
    var tuple = dataset.add({ country: 'Argentina', category: 'Beverages', product: 'Coffee', data: 100 });
    test.equal(dataset.size(), 2);
};

exports['add third tuple'] = function (test) {
    var tuple = dataset.add({ country: 'Chile', category: 'Beverages', product: 'Coke', notadimension: 123 });
    test.equal(dataset.size(), 3);
};

exports['dimensions values'] = function (test) {
    test.ok(dimcountry.values);
    test.ok(dimcategory.values);
    test.ok(dimproduct.values);

    test.equal(dimcountry.values.length, 3);
    test.ok(dimcountry.values.indexOf('Argentina') >= 0);
    test.ok(dimcountry.values.indexOf('Chile') >= 0);

    test.equal(dimcategory.values.length, 2);
    test.ok(dimcategory.values.indexOf('Beverages') >= 0);

    test.equal(dimproduct.values.length, 4);
    test.ok(dimproduct.values.indexOf('Beer') >= 0);
    test.ok(dimproduct.values.indexOf('Coffee') >= 0);
    test.ok(dimproduct.values.indexOf('Coke') >= 0);
};

exports['count tuples'] = function (test) {
    var count = 0;
    var tuples = dataset.tuples();

    while (tuples.next() != null)
        count++;

    test.equal(count, 3);
};

exports['count with country filter'] = function (test) {
    var count = dataset.tuples().where({ country: 'Argentina' }).count();
    test.equal(count, 2);
};

exports['count with filters'] = function (test) {
    test.equal(dataset.tuples().where({ country: 'Argentina' }).count(), 2);
    test.equal(dataset.tuples().where({ category: 'Beverages' }).count(), 3);
    test.equal(dataset.tuples().where({ country: 'Chile', category: 'Beverages' }).count(), 1);
};

