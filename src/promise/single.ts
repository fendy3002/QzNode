import lo = require('lodash');
const debug = require('debug')("QzNode:promise:lockable");
const debugError = require('debug')("QzNode:promise:lockable/error");

import memoryEngine from './memoryEngine';
import * as qzPromise from './index';
import * as types from '../types';

class SinglePromise {
    constructor(option, handle) {
        this.option = option;
        this.handle = handle;
    }
    option: types.Qz.Promise.SingleOption;
    handle;
    delay = 0;
    timeout = 0;
    retry = {
        type: null,
        amount: 0
    };
    locks = [];

    withDelay(delay) {
        this.delay = delay;
    }
    withTimeout(timeout) {
        this.timeout = timeout;
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
    }
    addLock(key) {
        if (Array.isArray(key)) {
            this.locks = this.locks.concat(key);
        }
        else {
            this.locks.push(key);
        }
    }
    clearLock() {
        this.locks = [];
    }
    async exec() {
        if (this.delay > 0) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.delay);
            })
        }

        let lockHandle = async () => {
            let locks = [];
            for (let key of lo.sortBy(this.locks)) {
                let lock = await this.option.lockEngine.lock(key, this.option.lockTTL);
                locks.push(lock);
            }

        };
    }
}

const singleFactory = async (option) => {
    let context = {
        engine: await memoryEngine()
    };
    let handle = (handler) => {
        let context = {
            delay: 0,
            timeout: 0,
            retry: null,

        };

        let withDelay = (delay) => {
            context.delay = delay;

        }
        let withRetry = (amount, type) => {

        };
        let withTimeout = (timeout: number) => {

        };
        let withLock = (key) => {

        };
        let clearLock = () => {

        };
        let exec = async () => {

        };
        return {
            exec
        };
    };
    return {
        handle
    };
}

export default singleFactory;