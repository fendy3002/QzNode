var assert = require('assert');
var promiseLimit = require('../src/Promise/limit.js').default;

describe('Limit', function() {
    it('should execute 5 promises simultaneously', function(done) {
        var promises = [];
        for(var i = 0; i < 100; i++){
            promises.push(new Promise(resolve => resolve(i)));
        }
        var context = {
            loop: 0
        };
        promiseLimit({
            limit: 5
        })(promises, (values) => {
            context.loop++;
            assert.equal(5, values.length);
        }).then((values) => {
            assert.equal(20, context.loop);
            done();
        });
    });
});