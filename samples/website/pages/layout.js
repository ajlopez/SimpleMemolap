
var engine = require('../model/engine');

var dimensions = engine.getDimensions();

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
    res.write('<html><head><title>');
    res.write('Simple Memolap Web Site Sample: ' + title);
    res.write('</title>');
    res.write('<link rel="stylesheet" href="/css/bootstrap.css">');
    res.write('<link rel="stylesheet" href="/css/styles.css">');
    res.write('</head>');
    res.write('<body>');

    res.write('<div class="navbar">\n');
    res.write('<div class="navbar-inner">\n');
    res.write('<div class="container">\n');
    res.write('<div class="nav">\n');
    res.write('<ul class="nav">\n');

    res.write('<li>\n');
    res.write('<a href="/">Home</a>\n');
    res.write('</li>\n');
    res.write('<li class="dropdown">\n');
    res.write('<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dimensions<b class="caret"></b></a>\n');
    res.write('<ul class="dropdown-menu">\n');

    for (var n in dimensions) {
        var dimension = dimensions[n];
        res.write('<li>\n');
        res.write('<a href="/dimension?dimension=' + dimension.name + '">' + dimension.title + '</a>\n');
        res.write('</li>\n');
    }

    res.write('</ul>\n');
    res.write('</li>\n');

    res.write('</ul>\n');
    res.write('</div>\n');
    res.write('</div>\n');
    res.write('</div>\n');
    res.write('</div>\n');

    res.write('<div class="content">\n');
        
    res.write('<h1>');
    res.write(title);
    res.write('</h1>\n');
}

function doFooter(res)
{
    res.write('</div>\n');
    res.write('<div class="footer">Powered by <a href="https://github.com/ajlopez/SimpleMemolap">SimpleMemolap</a> and <a href="https://github.com/ajlopez/SimpleWeb">SimpleWeb</a>\n');

    res.write('<script src="/js/jquery.js"></script>\n');
    res.write('<script src="/js/bootstrap-dropdown.js"></script>\n');

    res.write('</body>\n');
    res.write('</html>\n');
}
