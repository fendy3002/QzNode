import moment = require('moment');
interface option {
    format ?: string
};
const dateSvc = (nunjucksEnv) => {
    nunjucksEnv.addFilter("date", (val: any, format = null, option: option = {}) => {
        format = format || process.env.DATE_FORMAT || "YYYY-MM-DD"
        let momentDate = null;
        if(option.format){
            momentDate = moment(val, option.format);
        }
        else{
            momentDate = moment(val);
        }
        const valType :string = typeof val;
        if(valType === "date"){
            return momentDate.format(format);
        }
        return momentDate.format(format);
    });
};
module.exports = dateSvc;