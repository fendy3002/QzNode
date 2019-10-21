import detectResolve from './detectResolve';

export default () => async (data, obj) => {
    for(let condition of obj.$or){
        let conditionEvaluation = await detectResolve()(data, condition);
        if(conditionEvaluation){
            return true;
        }
    }
    return false;
};