import lo = require('lodash');
import moment = require('moment');
export namespace type {
    export interface option {
        prefix?: string,
        validateKey?: boolean,
        notFoundKeyError?: boolean
    };
    export interface schemaObj {
        key: string,
        type: string,
        formatFrom?: string,
        formatTo?: string,
        endOfDay?: boolean
    };
    export interface schema {
        [key: string]: string | schemaObj
    };
    export interface content {
        [key: string]: any
    };
};

let emptyValue = (val) => {
    return val === undefined || val === null || val === "";
};
let getSortClauseRaw = (schema: type.schema = null, option: type.option = null) => {
    return (key, content) => {
        let keyParts = key.split(".");
        if (keyParts.length != 2) {
            throw new Error("Sort is malformed");
        }
        else {
            let sortIndex = keyParts[1];
            let sortOrder = 1;
            let sortField = null;
            if (content.indexOf(",") < 0) {
                sortField = content;
            }
            else {
                let valueParts = content.split(',');
                sortField = valueParts[0];
                if (valueParts[1] == "asc" || valueParts[1] == "1") {
                    sortOrder = 1;
                }
                else if (valueParts[1] == "desc" || valueParts[1] == "-1") {
                    sortOrder = -1;
                }
                else {
                    throw new Error("Sort order " + valueParts[1] + " is unrecognized");
                }
                sortField = valueParts[0];
            }
            if (schema[sortField]) {
                sortField = schema[sortField];
            }
            else {
                if (option.validateKey && option.notFoundKeyError) {
                    throw new Error(`Key "${key}" is not allowed`);
                }
                else if (option.validateKey && !option.notFoundKeyError) {
                    return {};
                }
            }
            return {
                [sortIndex]: [sortField, sortOrder]
            };
        }
    };
};

let service = async (content: type.content, schema: type.schema = null, option: type.option = null) => {
    let useOption = lo.merge({
        prefix: "sort",
        validateKey: false,
        notFoundKeyError: true
    }, option);
    let getSortClause = getSortClauseRaw(schema, useOption);
    let sort = {};
    for (let key of Object.keys(content)) {
        if (key.startsWith(useOption.prefix + ".")) {
            if (useOption.validateKey && !schema) {
                if (useOption.notFoundKeyError) {
                    throw new Error("No sort is allowed");
                }
                else {
                    return [];
                }
            }
            if (emptyValue(content[key])) {
                continue;
            }
            sort = {
                ...sort,
                ...getSortClause(key, content[key])
            };
        }
    }
    let arr = [];
    for (let key of lo.orderBy(Object.keys(sort))) {
        arr.push(sort[key]);
    }

    return arr;
};
export default service;