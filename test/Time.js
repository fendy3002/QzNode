let assert = require('assert');
let moment = require('moment');
let qz = require('../dist/index.js').default();
let lo = require('lodash');
let path = require('path');

describe('Time', function() {
    describe('isBetween', function() {
        it('positively compare time', function(done) {
            let time = moment("2012-02-04 08:45:45");
            
            assert.equal(qz.time.isBetween(time, "07:00", "10:00"), true);
            assert.equal(qz.time.isBetween(time, "08:45", "08:45"), true);
            assert.equal(qz.time.isBetween(time, "23:00", "10:00"), true);

            done();
        });
        it('negatively compare time', function(done) {
            let time = moment("2012-02-04 12:45:45");
            assert.equal(qz.time.isBetween(time, "07:00", "10:00"), false);
            assert.equal(qz.time.isBetween(time, "12:46", "12:46"), false);
            assert.equal(qz.time.isBetween(time, "23:00", "10:00"), false);

            done();
        });
    });
});