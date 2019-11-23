import lo = require('lodash');
import moment = require('moment');
const debug = require('debug')("@fendy3002/logical-compare:propResolve");

const propResolve = () => async (data, obj) => {
    debug("obj", obj);
    if (obj && typeof (obj) == "object" && obj.hasOwnProperty("$date")) {
        let dateValue = obj.$date;
        let convertFrom = (dateValue) => {
            if (!obj.formatFrom) {
                return moment(dateValue);
            }
            else {
                if (obj.formatFrom.toLowerCase() == "timestamp") {
                    if (dateValue < 9999999999) {
                        return moment.unix(dateValue);
                    }
                    else {
                        return moment(dateValue);
                    }
                }
                else {
                    return moment(dateValue, obj.formatFrom);
                }
            }
        };
        let convertTo = (momentValue) => {
            if (!obj.formatTo) {
                return momentValue.toDate();
            }
            else {
                if (obj.formatTo.toLowerCase() == "timestamp") {
                    return momentValue.valueOf();
                }
                else if (obj.formatTo.toLowerCase() == "unix") {
                    return momentValue.unix();
                }
                else {
                    return momentValue.toDate();
                }
            }
        };
        if (dateValue === "now") {
            return convertTo(moment());
        }
        else if (dateValue === "today") {
            return convertTo(moment(moment(), "YYYY-MM-DD"));
        }
        else {
            let source = null;
            if (typeof (dateValue) == "object" && dateValue.hasOwnProperty("$prop")) {
                source = convertFrom(await propResolve()(data, dateValue));
            }
            else {
                source = convertFrom(dateValue);
            }
            return convertTo(source);
        }
    }
    else if (obj && typeof (obj) == "object" && obj.hasOwnProperty("$boolean")) {
        if (typeof (obj.$boolean) == "boolean") {
            return obj.$boolean;
        }
        else {
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