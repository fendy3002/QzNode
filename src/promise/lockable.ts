import { rethrow } from '../error/index';
import Redlock = require("redlock");
import lo = require('lodash');
const debug = require('debug')("QzNode:promise:lockable");
const debugError = require('debug')("QzNode:promise:lockable/error");
const { promisify } = require("util");

import * as types from '../types';

export const lockable: types.Promise.LockableSpawner = (redisClient, option) => {
    let clients = [];
    if (Array.isArray(redisClient)) {
        clients = redisClient;
    }
    else {
        clients = [redisClient];
    }
    let clientsGet = async (keys) => {
        let result = [];
        for (let client of clients) {
            const getAsync = promisify(client.get).bind(client);
            for (let key of keys) {
                result.push(await getAsync(key));
            }
        }
        return result.filter(k => k);
    }

    let redlock = new Redlock(clients, {
        driftFactor: option?.redlock?.driftFactor ?? 0.01,
        retryCount: option?.redlock?.retryCount ?? 20,
        retryDelay: option?.redlock?.retryDelay ?? 2000,
        retryJitter: option?.redlock?.retryJitter ?? 200
    });
    redlock.on('clientError', function (err) {
        debugError(err);
    });

    let ttl = option?.redlock?.ttl ?? 30000; // 30 secs

    let exec = (handle, keysArr) => {
        return async () => {
            let lockArr = [];
            for (let key of lo.sortBy(keysArr)) {
                let lock = await redlock.lock(`_L_${key}`, ttl);
                lockArr.push(lock);
            }
            let unlock = async () => {
                for (let lock of lockArr) {
                    await lock.unlock();
                }
            };
            let extend = async (ms: number) => {
                let newLockArr = []
                for (let lock of lockArr) {
                    newLockArr.push(await lock.extend(ms));
                }
                lockArr = newLockArr;
            };
            if (keysArr.length > 0) {
                debug(keysArr.join(",") + " locked", lockArr.length);
            }
            let handleException = null;
            try {
                await handle({
                    extend
                });
            } catch (ex) {
                handleException = ex;
                throw rethrow.from(ex).original().asIs();
            } finally {
                try {
                    await unlock();
                } catch (ex) {
                    await option?.unlock?.onWarning?.(ex);
                    let existingKeys = await clientsGet(keysArr);
                    if (existingKeys && existingKeys.length > 0) {
                        await option?.unlock?.onError?.(ex);
                    }
                }
                if (keysArr.length > 0) {
                    debug(keysArr.join(",") + " released");
                }
            }
        }
    };

    let andLock = (handle, existing: string[]) => {
        return (key: string) => {
            return {
                withLock: andLock(handle, existing.concat([key])),
                exec: exec(handle, existing.concat([key]))
            };
        };
    };

    return {
        process: (handle) => {
            return {
                withLock: andLock(handle, []),
                exec: exec(handle, [])
            };
        }
    };
};