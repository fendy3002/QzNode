import lo = require('lodash');
const replaceFileName = (original: string, schema: any) => {
    let regExp = new RegExp('\\[(.*?)\\]', 'gm');

    let result = original;
    let match;
    do {
        match = regExp.exec(original);
        if(match){
            result = result.replace(match[0], lo.get(schema, match[1]));
        }
    } while (match);
    // for (const key of Object.keys(replacement)) {
    //     result = result.replace(key, replacement[key]);
    // }
    result = result.replace(".template", "");
    return result;
};

export default {
    replace: replaceFileName
};