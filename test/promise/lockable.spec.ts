import * as mocha from 'mocha';
import * as QzPromise from '../../src/promise';
let assert = require('assert');
let lo = require('lodash');
let redis = require('redis');

mocha.describe('Promise lockable', function () {
    mocha.it('should lock and unlock successfully', async function () {
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
    mocha.it('should throw warning on unlock', async function () {
        let redisClient = redis.createClient({
            host: 'localhost',
            port: '6379'
        });

        let taskContext = {
            times: 0,
            warning: 0,
            error: 0
        };
        let lockable = await QzPromise.lockable(redisClient, {
            redlock: {
                ttl: 300,
                retryCount: 3,
            },
            unlock: {
                onWarning: async (err) => {
                    taskContext.warning++;
                },
                onError: async (err) => {
                    taskContext.error++;
                },
            }
        });
        let task = lockable.process(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    taskContext.times++;
                    resolve();
                }, 400)
            });
        }).withLock("L_1").withLock("L_2");

        await task.exec();
        assert.equal(taskContext.times, 1);
        assert.equal(taskContext.warning, 1);
        assert.equal(taskContext.error, 0);
    });
});