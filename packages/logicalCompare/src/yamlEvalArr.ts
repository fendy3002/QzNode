import yaml = require('js-yaml');
import jsonEvalArr from './jsonEvalArr';
export default () => async (data: any[], condition: string) => {
    return await jsonEvalArr()(data, yaml.load(condition));
};