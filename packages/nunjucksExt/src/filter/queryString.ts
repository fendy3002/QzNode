import lo = require('lodash');

const queryString = (nunjucksEnv) => {
    nunjucksEnv.addGlobal("queryString", (req) => {
        let result = "";
        lo.forOwn(req.query, (val, key) => {
            if(result){
                result += "&";
            }
            result += `${key}=${val}`;
        });
        return result;
    });
};

export = queryString;