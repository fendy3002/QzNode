import moment = require('moment');
interface option {
    format ?: string
};
const datetimeSvc = (nunjucksEnv) => {
    nunjucksEnv.addFilter("datetime", (val :any, format = null, option: option = {}) => {
        if(val){
            format = format || process.env.DATETIME_FORMAT || "YYYY-MM-DD"
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
        }

        return "-";
    });
};
export = datetimeSvc;