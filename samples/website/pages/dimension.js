
var engine = require('../model/engine'),
    layout = require('./layout');

exports = module.exports = function (req, res) {
    var dimension = engine.getDimension(req.query.dimension);
    var model = { dimension: dimension };
    req.model = model;
    layout(req, res, { title: dimension.title }, doBody);
}

function doBody(req, res)
{
    res.write('<table class="table-striped table-bordered">\n');
    req.model.dimension.values.forEach(function (value) {
        res.write('<tr><td>' + value + '</td></tr>\n');
    });
    res.write('</table>');
}
