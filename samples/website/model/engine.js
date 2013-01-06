
var simplememolap = require('../../..');

var engine = simplememolap.createEngine();

var dim = engine.createDimension('country');
dim.title = 'Countries';
dim = engine.createDimension('category');
dim.title = 'Categories';
dim = engine.createDimension('product');
dim.title = 'Products';

module.exports = exports = engine;
