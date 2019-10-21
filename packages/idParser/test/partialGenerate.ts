import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import partialGenerate from '../src/partialGenerate';
import moment = require('moment');

mocha.describe("partialGenerate", function(this) {
    mocha.it("Should generate id", async function(){
        let result = await partialGenerate("INV/23/01/{{_id(6)}}/X993", async (payload) => {
            return 7;
        });
        assert.equal("INV/23/01/000007/X993", result);
    });
    mocha.it("Should generate id together with date", async function(){
        let expectedDate = moment().format("YYYY/MM");
        let result = await partialGenerate("INV/{{_date('YYYY/MM')}}/{{_id(6)}}/X993", async (payload) => {
            return 7;
        });
        assert.equal("INV/" + expectedDate +"/000007/X993", result);
    });
});