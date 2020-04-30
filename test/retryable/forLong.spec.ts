import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import retryable from '../../src/retryable';

mocha.describe("retryable forLong", function (this) {
    mocha.it("should retry 1 seconds and error", async function () {
        const handle = async () => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 80);
            })
            throw new Error("CustomError");
        };
        try {
            await retryable(handle).forLong(800);
        } catch (ex) {
            assert.equal(ex.message, "Error after retrying for 0.80 second(s)");
            assert.equal(ex.original.message, "CustomError");
        }
    });
    mocha.it("should retry success after 300ms", async function () {
        let startTime = new Date().getTime();
        const handle = async () => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 100);
            })
            if (new Date().getTime() - startTime < 300) {
                throw new Error("CustomError");
            }
        };
        await retryable(handle).forLong(1000);
        assert.equal(true, new Date().getTime() - startTime >= 300);
    });
});