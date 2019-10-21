import detectResolve from './detectResolve';
const debug = require('debug')("@fendy3002/logical-compare:compareResolve");

export default () => async (data, obj) => {
    debug("obj", obj);
    for(let condition of obj.$and){
        let conditionEvaluation = await detectResolve()(data, condition);
        debug(condition, conditionEvaluation);
        if(!conditionEvaluation){
            return false;
        }
    }
    return true;
};