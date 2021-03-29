import * as mocha from 'mocha';
import * as QzPromise from '../../src/promise';
let assert = require('assert');
let lo = require('lodash');
let redis = require('redis');

mocha.describe.only('Promise lockable', function () {
    mocha.it('should lock 3 times and unlock successfully', async function () {
        let redisClient = redis.createClient({
            host: 'localhost',
            port: '6379'
        });

        let taskContext = {
            times: 0
        };
        let lockable = await QzPromise.lockable(redisClient);
        let task = lockable.process(async () => {
            taskContext.times++;
        }).withLock("L_1").withLock("L_2");

        await task.exec();
        assert.equal(taskContext.times, 1);
    });
});