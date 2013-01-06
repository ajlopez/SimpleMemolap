
var simplememolap = require('../../..'),
    path = require('path');
    fs = require('fs');

var engine = simplememolap.createEngine();

var content = fs.readFileSync(path.join(__dirname, 'model.json')).toString();
eval(content);

var dimensions = [];

model.dimensions.forEach(function (dim) {
    var dimension = engine.createDimension(dim.name);
    dimension.title = dim.title;
    dimension.set = dim.set;
    dimensions.push(dimension);
});

var ndimensions = dimensions.length;

function generateTuples(ndim, obj) {
    if (ndim >= ndimensions) {
        engine.addTuple(obj);
        return;
    }

    var dimension = dimensions[ndim];

    if (!dimension.set)
        return generateTuples(ndim + 1, obj);

    model.sets[dimension.set].forEach(function (value) {
        if (typeof value !== 'object')
            obj[dimension.name] = value;
        else {
            obj[dimension.name] = value.name;
            for (var n in value)
                if (n !== 'name')
                    obj[n] = value[n];
        }

        generateTuples(ndim + 1, obj);
    });
}

generateTuples(0, { });

engine.forEachTuple(function (tuple) { console.dir(tuple); });

module.exports = exports = engine;
