
var engine = require('../model/engine'),
    fs = require('fs'),
    path = require('path'),
    simpletpl = require('simpletpl');

var dimensions = engine.getDimensions();

function compileTemplate(filename) {
    filename = path.join(__dirname, filename);
    var text = fs.readFileSync(filename).toString();
    return simpletpl.compileTemplate(text);
}

var header = compileTemplate('header.tpl');
var footer = compileTemplate('footer.tpl');

exports = module.exports = function (req, res, model, body) {
    doHeader(res, model);
    body(req, res);
    doFooter(res, model);
    res.end();
}

function doHeader(res, model)
{
    var title = model.title;

    res.writeHead(200, {'content-type': 'text/html'});
    res.write(header({ title: model.title, dimensions: dimensions }));
}

function doFooter(res)
{
    res.write(footer());
}
