import yaml = require('yamljs');
import detectResolve from './detectResolve';
export default() => async (data, condition: string) => {
    return await detectResolve()(data, yaml.parse(condition));
};