
var engine = require('../model/engine'),
    layout = require('./layout'),
    fs = require('fs'),
    path = require('path'),
    simpletpl = require('simpletpl');

function compileTemplate(filename) {
    filename = path.join(__dirname, filename);
    var text = fs.readFileSync(filename).toString();
    return simpletpl.compileTemplate(text);
}

var body = compileTemplate('dimension.tpl');

exports = module.exports = function (req, res) {
    var dimension = engine.getDimension(req.query.dim);
    var dimname = dimension.name;
    var filter = { };

    if (req.query.dim1)
        filter[req.query.dim1] = req.query.val1;

    if (req.query.dim2)
        filter[req.query.dim2] = req.query.val2;

    var model = { dimension: dimension, params: req.query, dimensions: engine.getDimensions() };
    var values = [];

    if (req.query.dim1 || req.query.dim2)
        model.filter = filter;
    if (req.query.dim1)
        model.dimension1 = engine.getDimension(req.query.dim1);
    if (req.query.dim2)
        model.dimension2 = engine.getDimension(req.query.dim2);

    engine.forEachTuple(filter, function (tuple) {
        var name = tuple[dimname];
        if (!name)
            return;
        var nvalues = values.length;
        for (var k = 0; k < nvalues; k++)
            if (values[k].name === name) {
                values[k].count++;
                values[k].quantity += tuple.data.quantity;
                values[k].total += tuple.data.quantity * tuple.data.price;
                
                return;
            }

        values.push({ name: name, count: 1, quantity: tuple.data.quantity, total: tuple.data.quantity * tuple.data.price });
    });

    model.values = values;

    layout(req, res, { title: 'Sales' }, function (req, res) { doBody(req, res, model); });
}

function doBody(req, res, model)
{
    res.write(body(model));
}
