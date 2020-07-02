import lo = require('lodash');
const debug = require('debug')("QzNode:promise:lockable");
const debugError = require('debug')("QzNode:promise:lockable/error");

import memoryEngine from './memoryEngine';
import * as qzPromise from './index';
import * as types from '../types';

let singlePromise = (option: types.Qz.Promise.SingleOption, handler) => {
    return {
        withDelay(delay) {
            if (delay < 0) {
                throw new Error("Delay must be greater or equal 0");
            }
            return singlePromise({
                ...option,
                delay: delay
            }, handler);
        },
        withTimeout: (timeout) => {
            if (timeout < 0) {
                throw new Error("Delay must be greater or equal 0");
            }
            return singlePromise({
                ...option,
                timeout: timeout
            }, handler);
        },
        withRetry: (amount, type, retryOption?: types.Qz.Promise.RetryableOptions) => {
            if (![
                "times",
                "ms"
            ].find(type)) {
                throw new Error("Retry type must be either 'times' or 'ms' ");
            }
            if (amount <= 0) {
                throw new Error("Retry amount must be greater than 0 ");
            }
            return singlePromise({
                ...option,
                retry: {
                    ...option.retry,
                    type: type,
                    amount: amount,
                    option: retryOption ?? option.retry.option
                }
            }, handler);
        },
        addLock: (key) => {
            if (Array.isArray(key)) {
                return singlePromise({
                    ...option,
                    locks: option.locks.concat(key)
                }, handler);
            }
            else {
                return singlePromise({
                    ...option,
                    locks: option.locks.concat([key])
                }, handler);
            }
        },
        clearLock: () => {
            return singlePromise({
                ...option,
                locks: []
            }, handler);
        },
        exec: async () => {
            if (option.delay > 0) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, option.delay);
                })
            }

            let timeoutHandle = () => {
                if (option.delay > 0) {
                    return Promise.race([
                        handler(),
                        new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                reject('Timed out');
                            }, option.delay);
                        })
                    ]);
                } else {
                    return handler();
                }
            };
            let lockHandle = async () => {
                let locks = [];
                for (let key of lo.sortBy(option.locks)) {
                    let lock = await option.lockEngine.lock(key, option.lockTTL);
                    locks.push(lock);
                }
                try {
                    await timeoutHandle();
                } finally {
                    for (let lock of locks) {
                        await lock.unlock();
                    }
                    if (option.locks.length > 0) {
                        debug(option.locks.join(",") + " released");
                    }
                }
            };
            let retryHandle = async () => {
                if (option.retry.type == "times") {
                    return await qzPromise.retryable(lockHandle).times(option.retry.amount, option.retry.option);
                }
                else if (option.retry.type == "ms") {
                    return await qzPromise.retryable(lockHandle).times(option.retry.amount, option.retry.option);
                }
                else if (!option.retry.type) {
                    return lockHandle();
                }
            };
            return retryHandle();
        }
    };
};

const singleFactory = async () => {
    let defaultContext = {
        lockEngine: await memoryEngine(),
        lockTTL: 30000,
        delay: 0,
        timeout: 0,
        retry: {
            type: null,
            amount: 0,
            option: null,
        },
        locks: []
    };
    let handle = (context) => (handler) => {
        return singlePromise(context, handler);
    };

    let withEngine = (context) => (engine: types.Qz.Promise.LockEngine, ttl: number) => {
        let newContext = {
            ...context,
            lockEngine: engine,
            lockTTL: ttl
        };
        return {
            handle: handle(newContext),
            withEngine: withEngine(newContext)
        };
    };
    return {
        withEngine: withEngine(defaultContext),
        handle: handle(defaultContext)
    };
}

export default singleFactory;