import * as types from './types';
export default (config: types.LogConfig) => {
    let levelMap = {
        "error": 1,
        "info": 2,
        "debug": 3
    };
    return async (message: string, level: string) => {
        if (
            levelMap[level] <= levelMap[config.level]
        ) {
            if (config.write) {
                await config.write(message);
            }
        }
    };
}