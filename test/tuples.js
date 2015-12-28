
var sm = require('../');

var engine = sm.engine();

// Dimensions

var dimcountry = engine.dimension('country');
var dimcategory = engine.dimension('category');
var dimproduct = engine.dimension('product');

var dimensions = engine.dimensions();

exports['add tuple'] = function (test) {
    engine.add({ country: 'Argentina', category: 'Beverages', product: 'Beer' });
    test.equal(engine.size(), 1);
};

exports['add another tuple'] = function (test) {
    var tuple = engine.add({ country: 'Argentina', category: 'Beverages', product: 'Coffee', data: 100 });
    test.equal(engine.size(), 2);
};

exports['add third tuple'] = function (test) {
    var tuple = engine.add({ country: 'Chile', category: 'Beverages', product: 'Coke', notadimension: 123 });
    test.equal(engine.size(), 3);
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
    var tuples = engine.tuples();

    while (tuples.next() != null)
        count++;

    test.equal(count, 3);
};

exports['count with country filter'] = function (test) {
    var count = engine.tuples().where({ country: 'Argentina' }).count();
    test.equal(count, 2);
};

exports['count with filters'] = function (test) {
    test.equal(engine.tuples().where({ country: 'Argentina' }).count(), 2);
    test.equal(engine.tuples().where({ category: 'Beverages' }).count(), 3);
    test.equal(engine.tuples().where({ country: 'Chile', category: 'Beverages' }).count(), 1);
};

