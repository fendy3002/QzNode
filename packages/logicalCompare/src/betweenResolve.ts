import propResolve from './propResolve';
import moment = require('moment');
const debug = require('debug')("@fendy3002/logical-compare:betweenResolve");

export default () => {

    return async (data, obj) => {
        debug("obj", obj);
        let condition = obj.$between || obj.$betweenEx;
        let logic = (k, l, m) => k <= l && l <= m;
        if (obj.hasOwnProperty("$betweenEx")) {
            logic = (k, l, m) => k < l && l < m;
        }
        debug("logic", logic);
        let minField = await propResolve()(data, condition[0]);
        let valueField = await propResolve()(data, condition[1]);
        let maxField = await propResolve()(data, condition[2]);

        if (valueField instanceof Date) {
            let minCompare = moment(valueField).diff(moment(minField), "seconds");
            let maxCompare = moment(maxField).diff(moment(valueField), "seconds");
            return logic(minCompare, 0, maxCompare);
        }
        else {
            return logic(minField, valueField, maxField);
        }
    };
}