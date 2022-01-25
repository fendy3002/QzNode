import * as types from '../types';
import * as rethrow from '../error/rethrow';
export const retryable: types.Promise.Retryable = (handle: types.Promise.RetryableHandle) => {
    const times = async (number: number, opts?: types.Promise.RetryableOptions) => {
        let tryingTimes = 0;
        let throwEx = null;
        let canRetry = true;
        while (canRetry && tryingTimes <= number) {
            if (tryingTimes > 0 && opts?.delay > 0) {
                await new Promise<void>((resolve) => {
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
    const forLong = async (duration: number, opts?: types.Promise.RetryableOptions) => {
        const tsNow = new Date().getTime();
        let throwEx = null;
        let isRetry = false;
        let canRetry = true;
        let lastRetry = new Date().getTime();
        while (canRetry && (lastRetry = new Date().getTime()) - tsNow <= duration) {
            if (isRetry && opts?.delay > 0) {
                await new Promise<void>((resolve) => {
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
    };
};