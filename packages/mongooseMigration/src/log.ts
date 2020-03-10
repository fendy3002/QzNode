import * as types from './types';
export default (config: types.MigrateConfig<any>) => {
    let levelMap = {
        "error": 1,
        "info": 2,
        "debug": 3
    };
    return async (message: string, level: string) => {
        if (
            levelMap[config.log.level] <= levelMap[level]
        ) {
            if (config.log.write) {
                await config.log.write(message);
            }
        }
    };
}