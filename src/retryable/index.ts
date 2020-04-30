import * as rethrow from '../error/rethrow';
interface Handle {
    (): Promise<void | any>
}
interface Options {
    delay?: number
}
const retryable = (handle: Handle, opts?: Options) => {
    const times = async (number: number) => {
        let tryingTimes = 0;
        let throwEx = null;
        while (tryingTimes <= number) {
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
            }
        }
        throw rethrow.from(throwEx).message(`Error after retrying for ${number} times`);
    };
    const forLong = async (duration: number, opts?: Options) => {
        const tsNow = new Date().getTime();
        let throwEx = null;
        let isRetry = false;
        while (new Date().getTime() - tsNow <= duration) {
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
            }
        }
        throw rethrow.from(throwEx).message(`Error after retrying for ${(duration / 1000).toFixed(2)} second(s)`);
    };
    return {
        times,
        forLong
    }
};

export default retryable;