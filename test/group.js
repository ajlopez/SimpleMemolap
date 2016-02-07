
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

exports['get group dimension'] = function (test) {
    var dataset = generateTuples(10, 10, 10);
    
    var group = dataset.tuples().group("category");
    
    test.ok(group);
    test.ok(group.dimensions());
    test.equal(group.dimensions().length, 1);
    test.equal(group.dimensions()[0].name, 'category');
};

