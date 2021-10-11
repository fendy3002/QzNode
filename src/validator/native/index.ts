import moment = require('moment');
export const isNumeric = (val) => {
    return !isNaN(parseFloat(val)) && isFinite(val);
};
export const isInteger = (val) => {
    return isNumeric(val) && Number.isInteger(parseInt(val));
};
export const isDate = (val, format = null) => {
    if(!format){
        return moment(val).isValid();
    }
    return moment(val, format).isValid();
};