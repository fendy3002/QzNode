import path = require('path');
import fs = require('fs');
import * as types from './types';

import nunjucks = require('nunjucks');
const getHelper = async (context: types.Context) => {
    const extensions: any = {};
    for (let extensionFile of fs.readdirSync(context.path.extension)) {
        let extensionFullPath = path.join(context.path.extension, extensionFile);
        let extensionRaw = (await import(extensionFullPath)).default;
        let extension = await extensionRaw(context.schema);
        let extensionName = "";
        if (!extension.name) {
            extensionName = path.basename(extensionFile);
        }
        else {
            extensionName = extension.name;
        }
        extensions["_" + extensionName] = extension.data;
    }

    const renderHelper = (helperName: string, data: any) => {
        return context.nunjucks.default.render(path.join(context.path.helper, helperName), {
            _helper: helper,
            _data: data,
            ...extensions
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