import * as mocha from 'mocha';

var assert = require('assert');
var qz = require('../src/index');
var path = require("path");

mocha.describe('Require', function() {
    mocha.it('should export modules in folders', function(done) {
        var services = qz().require(path.join(__dirname, "..", "testHelper", "require"), []);
        assert.deepEqual(Object.keys(services), ["one", "sub", "two"]);
        done();
    });
    mocha.it('should ignore two.js in folders', function(done) {
        var services = qz().require(path.join(__dirname, "..", "testHelper", "require"), ["two.js"]);
        assert.deepEqual(Object.keys(services), ["one", "sub"]);
        done();
    });
    mocha.it('should ignore three.js in sub folder', function(done) {
        var services = qz().require(path.join(__dirname, "..", "testHelper", "require"), ["sub/three.js"]);
        assert.deepEqual(Object.keys(services), ["one", "sub", "two"]);
        assert.deepEqual(Object.keys(services.sub), []);
        done();
    });
});