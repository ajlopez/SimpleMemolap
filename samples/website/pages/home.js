
var engine = require('../model/engine'),
    layout = require('./layout');

exports = module.exports = function (req, res) {
    layout(req, res, { title: 'Home' }, doBody);
}

function doBody(req, res)
{
    res.write('<div>Simple Memolap Web Site sample, in-memory MOLAP-like processing.</div>');
}
