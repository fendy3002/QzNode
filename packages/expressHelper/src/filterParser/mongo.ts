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
        formatFrom?: string
        formatTo?: string
    };
    export interface schema {
        [key: string]: string | schemaObj
    };
    export interface content {
        [key: string]: any
    };
};
let operationConverterRaw = (option: type.option = null, schema: type.schema = null, ) => {
    let crossCheckSchema = (key) => {
        if (schema) {
            if (schema[key]) {
                let schemaType = schema[key];
                if (typeof (schemaType) == "string") {
                    return {
                        key: schemaType,
                        value: (val) => val
                    };
                } else {
                    let schemaTypeObj: type.schemaObj = schemaType;
                    let valConverter = (val) => val;
                    if (schemaTypeObj.type == "number") {
                        valConverter = (val) => parseFloat(val);
                    }
                    else if (schemaTypeObj.type == "boolean" || schemaTypeObj.type == "bool") {
                        valConverter = (val) => val == "1" || val.toLowerCase() == "true";
                    }
                    else if (schemaTypeObj.type == "date") {
                        schemaTypeObj.formatFrom = schemaTypeObj.formatFrom || "YYYY-MM-DD";
                        schemaTypeObj.formatTo = schemaTypeObj.formatTo || "YYYY-MM-DD";
                        valConverter = (val) => moment(val, schemaTypeObj.formatFrom).format(schemaTypeObj.formatTo);
                    }
                    else if (schemaTypeObj.type == "timestamp") {
                        let formatToConverter = (val) => val.valueOf();
                        if (schemaTypeObj.formatTo == "second" || schemaTypeObj.formatTo == "seconds") {
                            formatToConverter = (val) => val.unix();
                        }
                        if (schemaTypeObj.formatFrom == "timestamp" || !schemaTypeObj.formatFrom) {
                            valConverter = (val) => formatToConverter(moment(val));
                        }
                        else if (schemaTypeObj.formatFrom == "second" || schemaTypeObj.formatFrom == "seconds") {
                            valConverter = (val) => formatToConverter(moment.unix(val));
                        }
                        valConverter = (val) => formatToConverter(moment(val, schemaTypeObj.formatFrom));
                    }
                    return {
                        key: schemaType.key,
                        value: valConverter
                    };
                }
            }
            else if (option.validateKey) {
                if (option.notFoundKeyError) {
                    throw new Error(`Key "${key}" is not allowed`);
                }
                else {
                    return null;
                }
            }
        }
        return {
            key: key,
            value: (val) => val
        };
    };
    let keyOperation = (operation) => (key, value) => {
        let crossCheckResult = crossCheckSchema(key);
        if (crossCheckResult) {
            return {
                [crossCheckResult.key]: {
                    [operation]: crossCheckResult.value(value)
                }
            };
        }
        else {
            return null;
        }
    };
    let opIn = (key, value) => {
        let crossCheckResult = crossCheckSchema(key);
        if (crossCheckResult) {
            let returnValue = [];
            if (typeof (value) == "string") {
                returnValue = value.split(",").map(k => k.trim());
            }
            else if (Array.isArray(value)) {
                returnValue = value;
            }
            return {
                [crossCheckResult.key]: {
                    $in: returnValue
                }
            };
        }
        else {
            return null;
        }
    };
    let regex = (key, value) => {
        let crossCheckResult = crossCheckSchema(key);
        if (crossCheckResult) {
            return {
                [crossCheckResult.key]: {
                    "$regex": value,
                    "$options": "gim"
                }
            };
        }
        else {
            return null;
        }
    };
    let contains = (key, value) => {
        return regex(key, ".*" + value + ".*");
    };
    let startsWith = (key, value) => {
        return regex(key, "^" + value);
    };
    let endsWith = (key, value) => {
        return regex(key, value + "$");
    };
    return {
        "eq": keyOperation("$eq"),
        "ne": keyOperation("$ne"),
        "from": keyOperation("$gte"),
        "gte": keyOperation("$gte"),
        "gt": keyOperation("$gt"),
        "to": keyOperation("$lte"),
        "lte": keyOperation("$lte"),
        "lt": keyOperation("$lt"),
        "in": opIn,
        "regex": regex,
        "contains": contains,
        "starts_with": startsWith,
        "ends_with": endsWith
    };
};

let emptyValue = (val) => {
    return val === undefined || val === null || val === "";
};
let service = async (content: type.content, schema: type.schema = null, option: type.option = null) => {
    let useOption = lo.merge({
        prefix: "filter",
        validateKey: false,
        notFoundKeyError: true
    }, option);
    let operationConverter = operationConverterRaw(useOption, schema);

    let filter = [];
    for (let key of Object.keys(content)) {
        if (key.startsWith(useOption.prefix + ".")) {
            if (useOption.validateKey && !schema) {
                if (useOption.notFoundKeyError) {
                    throw new Error("No filter is allowed");
                }
                else {
                    return {};
                }
            }
            if (emptyValue(content[key])) {
                continue;
            }
            let keyParts = key.split(".");
            if (keyParts.length == 2) {
                let eachFilter = operationConverter["eq"](keyParts[1], content[key]);
                if (eachFilter) {
                    filter.push(eachFilter);
                }
            }
            else if (keyParts.length == 3) {
                let operation = keyParts[2];
                let eachFilter = operationConverter[operation](keyParts[1], content[key])
                if (eachFilter) {
                    filter.push(eachFilter);
                }
            }
        }
    }
    if (filter.length > 1) {
        return {
            "$and": filter
        };
    }
    else if (filter.length == 1) {
        return filter[0];
    }
    else {
        return {};
    }
};
export default service;