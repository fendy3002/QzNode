import detectResolve from './detectResolve';

export default () => async (data, obj) => {
    for(let condition of obj.$and){
        let conditionEvaluation = await detectResolve()(data, condition);
        if(!conditionEvaluation){
            return false;
        }
    }
    return true;
};