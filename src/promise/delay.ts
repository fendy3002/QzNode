import * as types from '../types';

let delayPromise = (option: types.Promise.DelayOption) => {
    return {
        onElapsed: (handler) => {
            return delayPromise({
                ...option,
                onElapsed: handler
            });
        },
        exec: async () => {
            await new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, option.delay);
            });
            if (option.onElapsed) {
                await option.onElapsed();
            }
        }
    }
};

export const delay = {
    for: (ms) => {
        return delayPromise({
            delay: ms
        })
    }
};