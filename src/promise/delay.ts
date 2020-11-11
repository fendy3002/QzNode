import * as types from '../types';

let delayPromise = (option: types.Qz.Promise.DelayOption) => {
    return {
        onElapsed: (handler) => {
            return delayPromise({
                ...option,
                onElapsed: handler
            });
        },
        exec: async () => {
            await new Promise((resolve, reject) => {
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

const delay = {
    for: (ms) => {
        return delayPromise({
            delay: ms
        })
    }
};

export default delay;