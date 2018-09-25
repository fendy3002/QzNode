import * as mocha from 'mocha';

let assert = require('assert');
let qz = require('../src/index');

mocha.describe('UUID', function() {
    mocha.describe('_', function() {
        mocha.it('should generate 32 unique char', function(done) {
            var uuid1 = qz().uuid();
            var uuid2 = qz().uuid();
            assert.equal(uuid1.length, 32);
            assert.equal(uuid2.length, 32);
            assert.notEqual(uuid1, uuid2);

            done();
        });
    });
});