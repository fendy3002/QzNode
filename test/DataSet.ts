import * as mocha from 'mocha';

var assert = require('assert');
const util = require('util');
mocha.describe('DataSet', function() {
    let dataSet = require('../src/DataSet/index');
    mocha.it('should convert array to key boolean object', function(done) {
        let arr = ['hello', 'world', 'this', 'day'];
        let actual = dataSet.arrToSet(arr);
        let expected = {
            'hello' : true, 
            'world' : true, 
            'this' : true, 
            'day' : true
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert array to value boolean object', function(done) {
        let arr = ['hello', 'world', 'this', 'day'];
        let actual = dataSet.arrToSet(arr, (val, index) => {
            return val + index;
        });
        let expected = {
            'hello' : 'hello0', 
            'world' : 'world1', 
            'this' : 'this2', 
            'day' : 'day3'
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert array to key value boolean object', function(done) {
        let arr = ['hello', 'world', 'this', 'day'];
        let actual = dataSet.arrToSet(
            arr, 
            (val, index) => {
                return true;
            }, (val, index) => {
                return val + index;
            });
        let expected = {
            'hello0' : true, 
            'world1' : true, 
            'this2' : true, 
            'day3' : true
        };
        assert.deepEqual(expected, actual);
        done();
    });
    mocha.it('should convert object array to key value boolean object', function(done) {
        let arr = [
            {key: 'hello'}, 
            {key: 'world'}, 
            {key: 'this'}, 
            {key: 'day'}
        ];
        let actual = dataSet.arrToSet(
            arr, 
            (val, index) => {
                return true;
            }, (val, index) => {
                return val.key + index;
            });
        let expected = {
            'hello0' : true, 
            'world1' : true, 
            'this2' : true, 
            'day3' : true
        };
        assert.deepEqual(expected, actual);
        done();
    });
});