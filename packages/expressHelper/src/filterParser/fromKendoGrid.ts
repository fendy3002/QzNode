import lo = require('lodash');
import moment = require('moment');
import { string } from '@fendy3002/qz-node';
import odataParser from '../odataParser';
import * as types from '../types';

interface toFilterObj {
    (source: string): types.filterParser.filterObj
}
let clean = (source: string) => {
    return string.replaceAll(source, "+", " ").trimLeft().trimRight();
};

let parseAnd = (sourceObj) => {
    let result = [
        ...parseObj(sourceObj.left)
    ];
    if (sourceObj.right) {
        result = [
            ...result,
            ...parseObj(sourceObj.right)
        ];
    }
    return result;
}
let functionMap = {
    "startswith": "starts_with",
    "endswith": "ends_with",
    "contains": "contains",
}
let parseFunctionCall = (sourceObj) => {
    if ([
        "startswith",
        "endswith",
        "contains",
    ].indexOf(sourceObj.func) > -1) {
        return [
            {
                [functionMap[sourceObj.func]]: {
                    "propertyName": sourceObj.args[0].name,
                    "value": sourceObj.args[1].value
                }
            },
        ];
    } else {
        throw new Error(`Func ${sourceObj.func} not supported`);
    }
};

let parseEq = (sourceObj) => {
    if (sourceObj.left.type == "functioncall" &&
        sourceObj.left.func == "indexof") {
        return [
            {
                "not_contains": {
                    "propertyName": sourceObj.left.args[0].name,
                    "value": sourceObj.left.args[1].value,
                }
            }
        ];
    } else {
        return [
            {
                "eq": {
                    "propertyName": sourceObj.left.name,
                    "value": sourceObj.right.value,
                }
            }
        ];
    }
}

let operationMap = {
    "gt": "gt",
    "ge": "ge",
    "lt": "lt",
    "le": "le",
    "ne": "ne"
}
let parseOperation = (sourceObj) => {
    return [
        {
            [operationMap[sourceObj.type]]: {
                "propertyName": sourceObj.left.name,
                "value": sourceObj.right.value
            }
        }
    ];
};

let parseObj = (sourceObj) => {
    // console.log(sourceObj.type, sourceObj);
    if (sourceObj.type == "and") {
        return parseAnd(sourceObj);
    } else if (sourceObj.type == "functioncall") {
        return parseFunctionCall(sourceObj);
    } else if (["eq"].indexOf(sourceObj.type) > -1) {
        return parseEq(sourceObj);
    } else if (["gt", "ge", "lt", "le", "ne"].indexOf(sourceObj.type) > -1) {
        return parseOperation(sourceObj);
    } else {
        throw new Error(`Type ${sourceObj.type} not supported`)
        return [];
    }
};

let toFilterObj: toFilterObj = (source: string) => {
    let parsed = odataParser.parse('$filter=' + clean(source)).$filter;
    return {
        "and": parseObj(parsed)
    };
};
export default {
    toFilterObj: toFilterObj
};