import nunjucks = require('nunjucks');
const jsonSvc = (nunjucksEnv) => {
    nunjucksEnv.addFilter("json", (value, spaces) => {
        if (value instanceof nunjucks.runtime.SafeString) {
            value = value.toString()
        }
        const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c');
        return new nunjucks.runtime.SafeString(jsonString);
    });
};
export = jsonSvc;