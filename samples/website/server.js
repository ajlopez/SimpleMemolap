
var simpleweb = require('simpleweb'),
    path = require('path'),
    http = require('http'),
    engine = require('./model/engine');
    
function doHeader(res, title)
{
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
    res.write('<li>\n');
    res.write('<a href="/customer">Customers</a>\n');
    res.write('</li>\n');

    res.write('</ul>\n');
    res.write('</div>\n');
    res.write('</div>\n');
    res.write('</div>\n');
    res.write('</div>\n');

    res.write('<div class="content">\n');
        
    res.write('<h1>');
    res.write(title);
    res.write('</h1>');
}

function doFooter(res)
{
    res.write('</div>');
    res.write('</body>');
    res.write('</html>');
}

function doTBD(res)
{
    res.write('<div>[TBD]</div>\n');
}

var app = simpleweb();

app.use(simpleweb.query());
app.use(simpleweb.body());
app.use(app.router);
app.use(simpleweb.static(path.join(__dirname, 'public')));
app.get('/', require('./pages/home'));

var server = http.createServer(app).listen(8000);

console.log('listening to http://localhost:8000');
