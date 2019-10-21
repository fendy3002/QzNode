import lo = require('lodash');
import moment = require('moment');
export default () => async (data, obj) => {
    if (obj && typeof(obj) == "object" && obj.hasOwnProperty("$date")) {
        let dateValue = obj.$date;
        if (dateValue === "now") {
            return new Date();
        }
        else if (dateValue === "today") {
            return moment(moment(), "YYYY-MM-DD").toDate();
        }
        else {
            return moment(dateValue);
        }
    }
    else {
        // assume $prop
        return lo.get(data, obj.$prop);
    }
};