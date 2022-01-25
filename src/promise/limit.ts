import * as types from '../types';
export const limit: types.Promise.Limit = async (handler, limit: number, opts?: types.Promise.LimitOptions) => {
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