import * as mocha from 'mocha';

let assert = require('assert');
let moment = require('moment');
let qz = require('../src/index');
let lo = require('lodash');
let path = require('path');

mocha.describe('Date', function() {
    mocha.describe('dateRangeToArray', function() {
        mocha.it('return three dates from string', function(done) {
            let result = qz().date.dateRangeToArray("2000-01-01", "2000-01-03");
            assert.equal(result.length, 3);
            done();
        });
        mocha.it('return three dates from moment', function(done) {
            let result = qz().date.dateRangeToArray(moment("2000-01-01"), moment("2000-01-03"));
            assert.equal(result.length, 3);
            done();
        });
    });
    mocha.describe('dateDurationToArray', function() {
        mocha.it('return three dates', function(done) {
            let result = qz().date.dateDurationToArray(moment("2000-01-01"), 3);
            assert.equal(result.length, 3);
            done();
        });
    });
});