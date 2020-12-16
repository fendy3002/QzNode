import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import retryable from '../../src/retryable';

mocha.describe("retryable times", function (this) {
    mocha.it("should retry 3 times and error", async function () {
        let retryTimes = 0;
        const handle = async () => {
            retryTimes++;
            throw new Error("CustomError");
        };
        try {
            await retryable(handle).times(3);
        } catch (ex) {
            assert.equal(ex.message, "Error after retrying for 3 times");
            assert.equal(ex.original.message, "CustomError");
            assert.equal(retryTimes, 4);
        }
    });
    mocha.it("should retry 3 times and success", async function () {
        let retryTimes = 0;
        const handle = async () => {
            retryTimes++;
            if (retryTimes < 3) {
                throw new Error("CustomError");
            }
        };
        await retryable(handle).times(5);
        assert.equal(retryTimes, 3);
    });
});