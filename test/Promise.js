let assert = require('assert');
let qz = require('../src/index.js').default();
let lo = require('lodash');

describe('QzPromise', function() {
    it('should have 3 consecutive callbacks', function(done) {
        let promise = qz.promise((resolve, reject) => resolve(1))
            .then((result) => (resolve, reject) => resolve(result + 1))
            .then((result) => (resolve, reject) => resolve(result + 1));
        
        let first = promise.before.before;
        new Promise(first.callback)
            .then((result) => {
                return new Promise(promise.before.callback(result));
            })
            .then((result) => {
                return new Promise(promise.callback(result));
            })
            .then((result) => {
                assert.equal(3, result);
                done();
            });
    });
});
describe('Limit', function() {
    it('should execute 5 promises simultaneously', function(done) {
        var promises = [];
        for(var i = 0; i < 100; i++){
            promises.push(
                qz.promise(resolve => resolve(i))
            );
        }
        var context = {
            loop: 0
        };
        var promiseLimit = qz.promise.limit({
            limit: 5
        });

        promiseLimit(promises, (values) => {
            context.loop++;
            assert.equal(5, values.length);
        }).then((values) => {
            assert.equal(20, context.loop);
            done();
        });
    });
    it('should execute 3 consecutive promises simultaneously', function(done) {
        let promises = [];
        for(let i = 0; i < 100; i++){
            promises.push(
                qz.promise((resolve, reject) => resolve(i))
                    .then((result) => (resolve, reject) => resolve(result + 1))
                    .then((result) => (resolve, reject) => resolve(result + 1))
            );
        }
        let context = {
            loop: 0
        };
        let promiseLimit = qz.promise.limit({
            limit: 5
        });

        promiseLimit(promises, (values) => {
            context.loop++;
            assert.equal(values.length, 5);
        }).then((values) => {
            assert.equal(context.loop, 20);
            assert.equal(values.length, 100);
            assert.equal(lo.sum(values), 5150);
            done();
        }).catch((err) => {
            console.log(err);
        });
    });
});
describe('Retry', function() {
    it('should retry 3 times', function(done) {
        let retry = qz.promise.retry;
        let token = 0;
        let promise = retry((resolve, reject) => {
            if(token == 2){ resolve(token); }
            else{ token++; reject(); }
        }, {retry: 3});

        new Promise(promise.callback).then((lastToken) => {
            assert.equal(token, 2);
            done();
        });
    });
    it('should retry 3 times and failed', function(done) {
        let retry = qz.promise.retry;
        let token = 0;
        let promise = retry((resolve, reject) => {
            token++;
            reject(token);
        }, {retry: 3});

        new Promise(promise.callback).catch((err) => {
            assert.equal(err, 4);
            done();
        });
    });
});