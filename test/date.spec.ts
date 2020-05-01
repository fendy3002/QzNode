import * as mocha from 'mocha';
import * as qzDate from '../src/date';

let assert = require('assert');
import moment = require('moment');
let path = require('path');

mocha.describe('Date', function () {
    mocha.describe('dateRangeToArray', function () {
        mocha.it('return three dates from moment', function (done) {
            let result = qzDate.fromMoment(moment("2000-01-01")).until(moment("2000-01-03").toDate()).toArray();
            assert.equal(result.length, 3);
            done();
        });
    });
    mocha.describe('dateDurationToArray', function () {
        mocha.it('return three dates', function (done) {
            let result = qzDate.fromMoment(moment("2000-01-01")).addDays(3).toArray();
            assert.equal(result.length, 3);
            done();
        });
    });
    mocha.describe('between', function () {
        mocha.it('between date', function (done) {
            let result = qzDate.fromMoment(moment("2000-01-01"))
                .until(moment("2000-01-03").toDate())
                .isAround(moment("2000-01-02").toDate());
            assert.equal(result, true);
            done();
        });
        mocha.it('between time', function (done) {
            let result = qzDate.fromMoment(moment("2000-01-01 05:00"))
                .isBetweenTime("00:00", "12:00");
            assert.equal(result, true);
            done();
        });
        mocha.it('between time false', function (done) {
            let result = qzDate.fromMoment(moment("2000-01-01 13:00"))
                .isBetweenTime("00:00", "12:00");
            assert.equal(result, false);
            done();
        });
        mocha.it('between time around', function (done) {
            let result = qzDate.fromMoment(moment("2000-01-01 13:00"))
                .isBetweenTime("12:00", "23:59");
            assert.equal(result, true);
            done();
        });
    });
});