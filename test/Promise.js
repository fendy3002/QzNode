var assert = require('assert');
var qz = require('../src/index.js').default();

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
});