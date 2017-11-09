var assert = require('assert');
var qz = require('../src/index.js').default();

describe('UUID', function() {
    describe('_', function() {
        it('should generate 32 unique char', function(done) {
            var uuid1 = qz.uuid();
            var uuid2 = qz.uuid();
            assert.equal(uuid1.length, 32);
            assert.equal(uuid2.length, 32);
            assert.notEqual(uuid1, uuid2);

            done();
        });
    });
});