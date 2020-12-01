import * as mocha from 'mocha';
import * as QzArray from '../src/array';
var assert = require('assert');
const util = require('util');
mocha.describe('Array', function () {
    mocha.it('should convert array to key boolean object', function (done) {
        let arr = ['hello', 'world', 'this', 'day'];
        let actual = QzArray.toSet(arr);
        let expected = {
            'hello': true,
            'world': true,
            'this': true,
            'day': true
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert array to value boolean object', function (done) {
        let arr = ['hello', 'world', 'this', 'day'];
        let actual = QzArray.toSet(arr, (val, index) => {
            return val + index;
        });
        let expected = {
            'hello': 'hello0',
            'world': 'world1',
            'this': 'this2',
            'day': 'day3'
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert array to key value boolean object', function (done) {
        let arr = ['hello', 'world', 'this', 'day'];
        let actual = QzArray.toSet(
            arr,
            (val, index) => {
                return true;
            }, (val, index) => {
                return val + index;
            });
        let expected = {
            'hello0': true,
            'world1': true,
            'this2': true,
            'day3': true
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert object array to key value boolean object', function (done) {
        let arr = [
            { key: 'hello' },
            { key: 'world' },
            { key: 'this' },
            { key: 'day' }
        ];
        let actual = QzArray.toSet(
            arr,
            (val, index) => {
                return true;
            }, (val, index) => {
                return val.key + index;
            });
        let expected = {
            'hello0': true,
            'world1': true,
            'this2': true,
            'day3': true
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert to object array from object', function (done) {
        let objectData = {
            'hello0': true,
            'world1': true,
            'this2': true,
            'day3': true
        };
        let actual = QzArray.fromSet(
            objectData,
            (val, key) => {
                return key;
            });
        let expected = [
            "hello0",
            "world1",
            "this2",
            "day3"
        ];
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should loop batch', async function () {
        let source = [];
        for (let i = 0; i < 1000; i++) {
            source.push(i);
        }
        let loopNumber = 0;
        await QzArray.batchLoop(source, 50).exec(async (batch) => {
            assert.equal(batch.length, 50);
            assert.deepEqual(batch, source.slice(loopNumber * 50, loopNumber * 50 + 50));
            loopNumber++;
        });

        let expectedLoopNumber = 20;
        assert.equal(expectedLoopNumber, loopNumber);
    });
});