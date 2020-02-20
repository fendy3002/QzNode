import fs = require('fs');
import path = require('path');
import nunjucks = require('nunjucks');
const renderHelper = (helperName: string, data: any) => {
    return nunjucks.render(path.join(process.cwd(), helperName), {
        _helper: helper,
        _data: data
    });
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

const helper = {
    renderHelper,
    isArr,
    asArr,
    inArray,
    isObj
};

const doTask = async () => {
    const helperDir = path.join(process.cwd(), "helper");
    const templateDir = path.join(process.cwd(), "template");
    const outputDir = path.join(process.cwd(), "output");

    
};
doTask();