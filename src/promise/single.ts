import lo = require('lodash');
const debug = require('debug')("QzNode:promise:lockable");
const debugError = require('debug')("QzNode:promise:lockable/error");

import memoryEngine from './memoryEngine';
import * as qzPromise from './index';
import * as types from '../types';

class SinglePromise {
    constructor(option: types.Qz.Promise.SingleOption, handler) {
        this.option = option;
        this.handler = handler;
    }
    option: types.Qz.Promise.SingleOption;
    handler;
    delay = 0;
    timeout = 0;
    retry = {
        type: null,
        amount: 0,
        option: null
    };
    locks = [];

    withDelay(delay) {
        this.delay = delay;
        return this;
    }
    withTimeout(timeout) {
        this.timeout = timeout;
        return this;
    }
    withRetry(amount, type) {
        if (![
            "times",
            "ms"
        ].find(type)) {
            throw new Error("Retry type must be either 'times' or 'ms' ");
        }
        if (amount <= 0) {
            throw new Error("Retry amount must be greater than 0 ");
        }
        this.retry.type = type;
        this.retry.amount = amount;
        return this;
    }
    addLock(key) {
        if (Array.isArray(key)) {
            this.locks = this.locks.concat(key);
        }
        else {
            this.locks.push(key);
        }
        return this;
    }
    clearLock() {
        this.locks = [];
        return this;
    }
    async exec() {
        if (this.delay > 0) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.delay);
            })
        }

        let timeoutHandle = () => {
            if (this.delay > 0) {
                return Promise.race([
                    this.handler(),
                    new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            reject('Timed out');
                        }, this.delay);
                    })
                ]);
            } else {
                return this.handler();
            }
        };
        let lockHandle = async () => {
            let locks = [];
            for (let key of lo.sortBy(this.locks)) {
                let lock = await this.option.lockEngine.lock(key, this.option.lockTTL);
                locks.push(lock);
            }
            try {
                await timeoutHandle();
            } finally {
                for (let lock of locks) {
                    await lock.unlock();
                }
                if (this.locks.length > 0) {
                    debug(this.locks.join(",") + " released");
                }
            }
        };
        let retryHandle = async () => {
            if (this.retry.type == "times") {
                return await qzPromise.retryable(lockHandle).times(this.retry.amount, this.retry.option);
            }
            else if (this.retry.type == "ms") {
                return await qzPromise.retryable(lockHandle).times(this.retry.amount, this.retry.option);

            }
            else if (!this.retry.type) {
                return lockHandle();
            }
        };
        return retryHandle();
    }
}

const singleFactory = async () => {
    let defaultContext = {
        lockEngine: await memoryEngine(),
        lockTTL: 30000
    };
    let handle = (context) => (handler) => {
        return new SinglePromise(context, handler);
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