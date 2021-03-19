import lo = require('lodash');
import moment = require('moment');
import { string } from '@fendy3002/qz-node';
import odataParser from '../odataParser';
import * as types from '../types';

interface toFilterObj {
    (source: string): types.filterParser.filterObj[]
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
let parseFunctionCall = (sourceObj) => {
    if (sourceObj.func == "startswith") {
        return [
            {
                "propertyName": sourceObj.args[0].name,
                "operation": "starts_with",
                "value": sourceObj.args[1].value
            },
        ];
    } else if (sourceObj.func == "contains") {
        return [
            {
                "propertyName": sourceObj.args[0].name,
                "operation": "contains",
                "value": sourceObj.args[1].value
            },
        ];
    }
};

let parseEq = (sourceObj) => {
    if (sourceObj.left.type == "functioncall" &&
        sourceObj.left.func == "indexof") {
        return [
            {
                "propertyName": sourceObj.left.args[0].name,
                "operation": "not_contains",
                "value": sourceObj.left.args[1].value,
            }
        ];
    } else {
        return [
            {
                "propertyName": sourceObj.left.name,
                "operation": "eq",
                "value": sourceObj.right.value,
            }
        ];
    }
}

let operationMap = {
    "gt": "gt",
    "ge": "ge",
    "lt": "lt",
    "le": "le",
}
let parseOperation = (sourceObj) => {
    return [
        {
            "propertyName": sourceObj.left.name,
            "operation": operationMap[sourceObj.type],
            "value": sourceObj.right.value
        }
    ]
}

let parseObj = (sourceObj) => {
    // console.log(sourceObj.type, sourceObj);
    if (sourceObj.type == "and") {
        return parseAnd(sourceObj);
    } else if (sourceObj.type == "functioncall") {
        return parseFunctionCall(sourceObj);
    } else if (["eq"].indexOf(sourceObj.type) > -1) {
        return parseEq(sourceObj);
    } else if (["gt", "ge", "lt", "le"].indexOf(sourceObj.type) > -1) {
        return parseOperation(sourceObj);
    } else {
        return [];
    }
}

export default {
    toFilterObj: (source: string) => {
        let parsed = odataParser.parse('$filter=' + clean(source)).$filter;
        return parseObj(parsed);
    }
};