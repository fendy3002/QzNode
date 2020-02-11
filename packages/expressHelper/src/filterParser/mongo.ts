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
let operationConverterRaw = (option: type.option = null, schema: type.schema = null, ) => {
    let crossCheckSchema = (key, operation: string) => {
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
                        schemaTypeObj.endOfDay = schemaTypeObj.endOfDay || false;
                        if (schemaTypeObj.endOfDay && (operation == "lte" || operation == "to")) {
                            valConverter = (val) => moment(val, schemaTypeObj.formatFrom).endOf('day').format(schemaTypeObj.formatTo);
                        }
                        else {
                            valConverter = (val) => moment(val, schemaTypeObj.formatFrom).format(schemaTypeObj.formatTo);
                        }
                    }
                    else if (schemaTypeObj.type == "timestamp") {
                        schemaTypeObj.endOfDay = schemaTypeObj.endOfDay || false;

                        let formatToConverter = (val) => val.valueOf();
                        if (schemaTypeObj.formatTo == "second" || schemaTypeObj.formatTo == "seconds") {
                            formatToConverter = (val) => val.unix();
                        }
                        let formatDay = formatToConverter;
                        if (schemaTypeObj.endOfDay && (operation == "lte" || operation == "to")) {
                            formatDay = (val) => formatToConverter(val.endOf('day'));
                        }

                        if (schemaTypeObj.formatFrom == "timestamp" || !schemaTypeObj.formatFrom) {
                            valConverter = (val) => formatDay(moment(val));
                        }
                        else if (schemaTypeObj.formatFrom == "second" || schemaTypeObj.formatFrom == "seconds") {
                            valConverter = (val) => formatDay(moment.unix(val));
                        }
                        else {
                            valConverter = (val) => formatDay(moment(val, schemaTypeObj.formatFrom));
                        }
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
    let keyOperation = (operation, code) => (key, value) => {
        let crossCheckResult = crossCheckSchema(key, code);
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
        let crossCheckResult = crossCheckSchema(key, "in");
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
    let opAll = (key, value) => {
        let crossCheckResult = crossCheckSchema(key, "all");
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
                    $all: returnValue
                }
            };
        }
        else {
            return null;
        }
    };
    let regex = (key, value) => {
        let crossCheckResult = crossCheckSchema(key, "regex");
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
        "eq": keyOperation("$eq", "eq"),
        "ne": keyOperation("$ne", "ne"),
        "from": keyOperation("$gte", "from"),
        "gte": keyOperation("$gte", "gte"),
        "gt": keyOperation("$gt", "gt"),
        "to": keyOperation("$lte", "to"),
        "lte": keyOperation("$lte", "lte"),
        "lt": keyOperation("$lt", "lt"),
        "in": opIn,
        "all": opAll,
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