
'use strict';

var simplememolap = (function () {
    function Engine() {
    }

    function createEngine () {
        return new Engine();
    }

    return {
        createEngine: createEngine
    }
})();

if (typeof window === 'undefined') {
	module.exports = simplememolap;
}
