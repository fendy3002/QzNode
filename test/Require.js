var assert = require('assert');
var qz = require('../src/index.js').default();
var path = require("path");

describe('Require', function() {
    it('should export modules in folders', function(done) {
        var services = qz.require(path.join(__dirname, "..", "dist", "Promise"), []);
        assert.deepEqual(Object.keys(services), ["index", "limit"]);
        done();
    });
    it('should ignore limit.js in folders', function(done) {
        var services = qz.require(path.join(__dirname, "..", "dist", "Promise"), ["limit.js"]);
        assert.deepEqual(Object.keys(services), ["index"]);
        done();
    });
});