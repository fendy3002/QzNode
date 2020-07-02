import * as mocha from 'mocha';
import * as QzPromise from '../../src/promise';
let assert = require('assert');
let lo = require('lodash');

mocha.describe('Promise single', function () {
    mocha.it('should retry 3 times because of timeout', async function () {
        let singleFactory = (await QzPromise.single());
        let testContext = {
            count: 0
        };

        try {
            await singleFactory.handle(async () => {
                testContext.count++;
                await singleFactory.handle(async () => { }).withDelay(500).exec();
            }).withTimeout(100).withRetry(3, "times").exec();
        } catch (err) {
            assert.equal(err.message, "Timed out");
        }
        assert.equal(testContext.count, 4);
    });
    mocha.it('should memory lock', async function () {
        let singleFactory = (await QzPromise.single());

        let promises = [];
        let now = new Date().getTime();
        for (let i = 0; i < 20; i++) {
            promises.push(
                singleFactory.handle(async () => {
                    await singleFactory.handle(async () => { }).withDelay(10).exec();
                }).addLock("myLock").exec()
            );
        }
        await Promise.all(promises);
        assert.equal(true, (new Date().getTime() - now) >= 10 * 20);
    });
});