import detectResolve from './detectResolve';
import propResolve from './propResolve';
import moment = require('moment');
const debug = require('debug')("@fendy3002/logical-compare:compareResolve");

const opEq = (propFrom, propWith) => {
    debug("operation eq", propFrom, propWith);

    if(propFrom instanceof Date){
        return moment(propFrom).isSame(moment(propWith), "day");
    }
    else{
        return propFrom == propWith;
    }
};
const opCompare = (propFrom, propWith, operator) => {
    debug("operation compare", propFrom, propWith, operator);
    
    if(propFrom instanceof Date){
        return operator(moment(propFrom).diff(moment(propWith), "seconds"), 0);
    }
    else{
        return operator(propFrom, propWith);
    }
};

export default () => {
    const getProp = async (data, obj) => {
        if(typeof(obj) == "object" && 
            (obj.hasOwnProperty("$prop") || 
            obj.hasOwnProperty("$date"))){
            return await propResolve()(data, obj);
        }
        else{
            return obj;
        }
    };
    return async (data, obj) => {
        let sourceField = await getProp(data, obj.$compare[0]);
        let operation = obj.$compare[1];
        let comparerField = await getProp(data, obj.$compare[2]);
        debug("operation", operation);

        switch(operation){
            case "eq":
                return opEq(sourceField, comparerField);
            case "ne":
                return !opEq(sourceField, comparerField);
            case "gt":
                return opCompare(sourceField, comparerField, (k, l) => k > l);
            case "gte":
                return opCompare(sourceField, comparerField, (k, l) => k >= l);
            case "lt":
                return opCompare(sourceField, comparerField, (k, l) => k < l);
            case "lte":
                return opCompare(sourceField, comparerField, (k, l) => k <= l);
            case "starts_with":
                return (sourceField as string).startsWith(comparerField);
            case "ends_with":
                return (sourceField as string).endsWith(comparerField);
            case "contains":
                return (sourceField as string).indexOf(comparerField) >= 0;
            case "in":
                return (comparerField as Array<string>).indexOf(sourceField as string) >= 0;
            case "regex":
                // to parse regex
                return null;
        }
    };
}