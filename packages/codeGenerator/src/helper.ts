import path = require('path');

import nunjucks = require('nunjucks');
const getHelper = (option) => {
    const renderHelper = (helperName: string, data: any) => {
        return nunjucks.render(path.join(option.path.helper, helperName), {
            _helper: helper,
            _data: data
        }).replace(/\n\s*\n/g, '\n');
    };
    const isArr = (val: any) => {
        return Array.isArray(val);
    };
    const asArr = (val: any) => {
        if (isArr(val)) { return val; }
        else { return [val]; }
    };
    const inArray = (stack: [any], needle: any) => {
        return stack.some(needle);
    };
    const isObj = (val: any) => {
        return typeof val == "object";
    };
    const appendObj = (original, additional) => {
        return {
            ...original,
            ...additional
        };
    };

    const helper = {
        renderHelper,
        isArr,
        asArr,
        inArray,
        isObj,
        appendObj,
        print: {
            open: "{{",
            close: "}}"
        },
        block: {
            open: "{%",
            close: "%}"
        }
    };
    return helper;
}
export default getHelper;