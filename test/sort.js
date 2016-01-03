
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

exports['sort by second dimension'] = function (test) {
    var dataset = generateTuples(10, 10, 10);
    
    var result = dataset.tuples().sort("category").toArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1000);
    
    for (var k = 1; k < 1000; k++)
        test.ok(result[k - 1].category <= result[k].category);
};

exports['sort by third and second dimension'] = function (test) {
    var dataset = generateTuples(10, 10, 10);
    
    var result = dataset.tuples().sort(["product", "category"]).toArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1000);
    
    for (var k = 1; k < 1000; k++)
        test.ok(result[k - 1].product < result[k].product || result[k - 1].product == result[k].product && result[k - 1].category <= result[k].category);
};

exports['sort by third and second dimension and filter'] = function (test) {
    var dataset = generateTuples(10, 10, 10);
    
    var result = dataset.tuples().sort(["product", "category"]).where({ category: 'Category 2' }).toArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 100);
    
    for (var k = 1; k < 100; k++)
        test.ok(result[k - 1].product < result[k].product || result[k - 1].product == result[k].product && result[k - 1].category <= result[k].category);
};

exports['sort by third and second dimension and count'] = function (test) {
    var dataset = generateTuples(10, 10, 10);
    
    var result = dataset.tuples().sort(["product", "category"]).count();
    
    test.equal(result, 1000);
};
