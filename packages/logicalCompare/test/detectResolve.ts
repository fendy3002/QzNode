import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import detectResolve from '../src/detectResolve';

mocha.describe("detectResolve", function(this) {
    mocha.it("should", async function(){
        let result = await detectResolve()({
            total_price: 99999
        }, {
            $compare: [
                {$prop: "total_price"},
                "gt",
                "10000"
            ]
        });
        assert.equal(true, result);
    });
});