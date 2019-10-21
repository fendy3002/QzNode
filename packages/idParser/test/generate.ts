import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import generate from '../src/generate';
import moment = require('moment');

mocha.describe("generate", function(this) {
    mocha.it("Should generate format", async function(){
        let result = await generate("MYINFO{{name}}", {name: "Luke Skywalker"});
        assert.equal("MYINFOLuke Skywalker", result);
    });
    mocha.it("Should generate random number", async function(){
        let result = await generate("{{_randomNumber(6)}}");
        assert.equal(6, result.length);
        assert.equal(true, isFinite(result));
    });
    mocha.it("Should generate date", async function(){
        let result = await generate("{{_date('YYYY-MM-DD')}}");
        assert.equal(moment().format("YYYY-MM-DD"), result);
    });
    mocha.it("Should handle unknown variable", async function(){
        await assert.rejects(
            async () => await generate("THISISNOVAR{{asdfasd}}"), 
            Error
        );
    });
});