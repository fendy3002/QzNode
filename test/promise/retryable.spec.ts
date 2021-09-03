import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import { retryable } from '../../src/promise';

mocha.describe("retryable", function (this) {
    mocha.it("should retry 3 times and error", async function () {
        let retryTimes = 0;
        const handle = async () => {
            retryTimes++;
            throw new Error("CustomError");
        };
        try {
            await retryable(handle).times(3);
        } catch (ex) {
            assert.equal(ex.message, "CustomError");
            assert.equal(ex.when.message, "Error after retrying for 3 time(s)");
            assert.equal(retryTimes, 4);
        }
    });
    mocha.it("should retry 1 times and error because condition", async function () {
        let retryTimes = 0;
        const handle = async () => {
            retryTimes++;
            if (retryTimes == 2) {
                throw new Error("CustomError1");
            }
            else {
                throw new Error("CustomError");
            }
        };
        try {
            await retryable(handle).times(3, {
                when: async (err) => {
                    return err.message == "CustomError"
                }
            });
        } catch (ex) {
            assert.equal(ex.message, "CustomError1");
            assert.equal(ex.when.message, "Error after retrying for 1 time(s)");
            assert.equal(retryTimes, 2);
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
    mocha.it("should retry 3 times and success with when", async function () {
        let retryTimes = 0;
        const handle = async () => {
            retryTimes++;
            if (retryTimes < 3) {
                throw new Error("CustomError");
            }
        };
        await retryable(handle).times(5, {
            when: async (err) => err.message == "CustomError"
        });
        assert.equal(retryTimes, 3);
    });
    mocha.it("should retry 1 seconds and error", async function () {
        const handle = async () => {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 80);
            })
            throw new Error("CustomError");
        };
        try {
            await retryable(handle).forLong(800);
        } catch (ex) {
            assert.equal(ex.message, "CustomError");
            assert.equal(ex.when.message.substring(0, 25), "Error after retrying for ");
        }
    });
    mocha.it("should retry 1 seconds and error because condition", async function () {
        let now = new Date().getTime();
        const handle = async () => {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 80);
            })
            if (new Date().getTime() - now > 1000) {
                throw new Error("CustomError1");
            }
            else {
                throw new Error("CustomError");
            }
        };
        try {
            await retryable(handle).forLong(1800);
        } catch (ex) {
            assert.equal(ex.message, "CustomError1");
            assert.equal(ex.when.message.substring(0, 25), "Error after retrying for ");
        }
    });
    mocha.it("should retry success after 300ms", async function () {
        let startTime = new Date().getTime();
        const handle = async () => {
            await new Promise<void>((resolve) => {
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
    mocha.it("should retry success after 300ms with when", async function () {
        let startTime = new Date().getTime();
        const handle = async () => {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 100);
            })
            if (new Date().getTime() - startTime < 300) {
                throw new Error("CustomError");
            }
        };
        await retryable(handle).forLong(1000, {
            when: async (err) => err.message == "CustomError"
        });
        assert.equal(true, new Date().getTime() - startTime >= 300);
    });
});