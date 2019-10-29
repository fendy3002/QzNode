import lo = require('lodash');
import moment = require('moment');
const debug = require('debug')("@fendy3002/logical-compare:propResolve");

const propResolve = () => async (data, obj) => {
    debug("obj", obj);
    if (obj && typeof (obj) == "object" && obj.hasOwnProperty("$date")) {
        let dateValue = obj.$date;
        if (dateValue === "now") {
            return new Date();
        }
        else if (dateValue === "today") {
            return moment(moment(), "YYYY-MM-DD").toDate();
        }
        else if (typeof (dateValue) == "object" && dateValue.hasOwnProperty("$prop")) {
            return moment(await propResolve()(data, dateValue)).toDate();
        }
        else {
            return moment(dateValue).toDate();
        }
    }
    else if (obj && typeof (obj) == "object" && obj.hasOwnProperty("$boolean")) {
        if(typeof(obj.$boolean) == "boolean" ){
            return obj.$boolean;
        }
        else{
            // assume string
            return obj.$boolean.toLowerCase() === "true";
        }
    }
    else if (obj && typeof (obj) == "object" && obj.hasOwnProperty("$prop")) {
        // assume $prop
        return lo.get(data, obj.$prop);
    }
    else {
        return obj;
    }
};
export default propResolve;