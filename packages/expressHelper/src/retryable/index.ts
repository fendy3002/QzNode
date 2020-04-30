import * as rethrow from '../errorHandler/rethrow';
interface Handle {
    (): Promise<void | any>
}
const retryable = (handle: Handle) => {
    const times = async (number: number) => {
        let tryingTimes = 0;
        let throwEx = null;
        while (tryingTimes <= number) {
            try {
                return await handle();
            } catch (ex) {
                throwEx = ex;
                tryingTimes++;
            }
        }
        throw rethrow.from(throwEx).message(`Error after retrying for ${number} times`);
    };
    const forLong = async (duration: number) => {
        const tsNow = new Date().getTime();
        let throwEx = null;
        while (new Date().getTime() - tsNow <= duration) {
            try {
                return await handle();
            } catch (ex) {
                throwEx = ex;
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