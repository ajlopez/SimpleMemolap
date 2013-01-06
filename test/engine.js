
var simplememolap = require('../'),
    assert = require('assert');

// createEngine defined

assert.ok(simplememolap.createEngine);
assert.equal(typeof simplememolap.createEngine, 'function');

// Create engine

var engine = simplememolap.createEngine();
assert.ok(engine);



