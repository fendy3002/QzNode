import detectResolve from './detectResolve';
import propResolve from './propResolve';
import moment = require('moment');
const debug = require('debug')("@fendy3002/logical-compare:compareResolve");

const opEq = (propFrom, propWith) => {
    debug("operation eq", propFrom, propWith);

    if (propFrom instanceof Date) {
        debug(`moment(propFrom).isSame(moment(propWith), "day")`, moment(propFrom).isSame(moment(propWith), "day"));
        return moment(propFrom).isSame(moment(propWith), "day");
    }
    else {
        return propFrom == propWith;
    }
};
const opCompare = (propFrom, propWith, operator) => {
    debug("operation compare", propFrom, propWith, operator);

    if (propFrom instanceof Date) {
        const secondsDiff = moment(propFrom).diff(moment(propWith), "seconds");
        debug("secondsDiff", secondsDiff);
        return operator(secondsDiff, 0);
    }
    else {
        return operator(propFrom, propWith);
    }
};

export default () => {
    return async (data, obj) => {
        let sourceField = await propResolve()(data, obj.$compare[0]);
        let operation = obj.$compare[1];
        let comparerField = await propResolve()(data, obj.$compare[2]);
        debug("operation", operation);

        switch (operation) {
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
            case "starts_with": {
                let sourceStr = (sourceField as string).toLowerCase()
                let comparerStr = (comparerField as string).toLowerCase()
                return sourceStr.startsWith(comparerStr);
            }
            case "ends_with": {
                let sourceStr = (sourceField as string).toLowerCase()
                let comparerStr = (comparerField as string).toLowerCase()
                return sourceStr.endsWith(comparerStr);
            }
            case "contains": {
                let sourceStr = (sourceField as string).toLowerCase()
                let comparerStr = (comparerField as string).toLowerCase()
                return sourceStr.indexOf(comparerStr) >= 0;
            }
            case "in": {
                let sourceStr = (sourceField as string).toLowerCase()
                return (comparerField as Array<string>).map(k => k.toLowerCase()).indexOf(sourceStr) >= 0;
            }
            case "regex":
                // to parse regex
                return null;
        }
    };
}