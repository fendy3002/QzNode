import yaml = require('js-yaml');
import detectResolve from './detectResolve';
export default() => async (data, condition: string) => {
    return await detectResolve()(data, yaml.load(condition));
};