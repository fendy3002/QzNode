import yaml = require('js-yaml');
import detectResolve from './detectResolve';
export default () => async (data: any[], conditionObj: any) => {
    let result = [];
    let index = 1;
    for (let each of data) {
        result.push({
            order: index++,
            data: each,
            evaluation: await detectResolve()(each, conditionObj)
        });
    }
    return result;
};