import * as types from '../types';
import * as rethrow from '../error/rethrow';
import lockable from './lockable';
import single from './single';
import delay from './delay';

const limit: types.Qz.Promise.Limit = async (handler, limit: number, opts?: types.Qz.Promise.LimitOptions) => {
    let result: any[] = [];
    let batch: (() => Promise<any | void>)[] = [];
    let isCancelling = false;

    for (let i = 1; i <= handler.length; i++) {
        batch.push(handler[i - 1]);
        if (i > 1 && i % limit == 0) {
            const batchResult = await Promise.all(
                batch.map(k => {
                    return k();
                })
            );
            result = result.concat(batchResult);
            if (opts?.onLoop) {
                await opts.onLoop(batchResult);
            }
            batch = [];
            isCancelling = opts?.stopSignal?.() ?? false;
            if (isCancelling) {
                break;
            }
        }
    }
    if (batch.length > 0 && !isCancelling) {
        result = result.concat(
            await Promise.all(batch.map(k => k()))
        );
        batch = [];
    }
    return result;
};
const retryable: types.Qz.Promise.Retryable = (handle: types.Qz.Promise.RetryableHandle) => {
    const times = async (number: number, opts?: types.Qz.Promise.RetryableOptions) => {
        let tryingTimes = 0;
        let throwEx = null;
        let canRetry = true;
        while (canRetry && tryingTimes <= number) {
            if (tryingTimes > 0 && opts?.delay > 0) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, opts.delay);
                })
            }
            try {
                return await handle();
            } catch (ex) {
                throwEx = ex;
                tryingTimes++;
                if (opts?.when && !(await opts.when(ex))) {
                    canRetry = false;
                }
            }
        }
        throw rethrow.from(throwEx).original().message(`Error after retrying for ${tryingTimes - 1} time(s)`);
    };
    const forLong = async (duration: number, opts?: types.Qz.Promise.RetryableOptions) => {
        const tsNow = new Date().getTime();
        let throwEx = null;
        let isRetry = false;
        let canRetry = true;
        let lastRetry = new Date().getTime();
        while (canRetry && (lastRetry = new Date().getTime()) - tsNow <= duration) {
            if (isRetry && opts?.delay > 0) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, opts.delay);
                })
            }
            try {
                return await handle();
            } catch (ex) {
                throwEx = ex;
                isRetry = true;
                if (opts?.when && !(await opts.when(ex))) {
                    canRetry = false;
                }
            }
        }
        throw rethrow.from(throwEx).original().message(`Error after retrying for ${((lastRetry - tsNow) / 1000).toFixed(2)} second(s)`);
    };
    return {
        times,
        forLong
    }
};
export {
    limit,
    retryable,
    lockable,
    delay,
    single
};