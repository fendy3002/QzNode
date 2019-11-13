import lo = require('lodash');
import moment = require('moment');
export namespace type {
    export interface option {
        prefix?: string,
        validateKey?: boolean
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
                    return {
                        key: schemaType.key,
                        value: valConverter
                    };
                }
            }
            else if (option.validateKey) {
                throw new Error("Key is not allowed");
            }
        }
        else {
            return {
                key: key,
                value: (val) => val
            }
        }
    };
    let gte = (key, value) => {
        let crossCheckResult = crossCheckSchema(key);
        return {
            [crossCheckResult.key]: {
                "$gte": crossCheckResult.value(value)
            }
        };
    };
    let lte = (key, value) => {
        let crossCheckResult = crossCheckSchema(key);
        return {
            [crossCheckResult.key]: {
                "$lte": crossCheckResult.value(value)
            }
        };
    };
    return {
        "eq": (key, value) => {
            let crossCheckResult = crossCheckSchema(key);
            return {
                [crossCheckResult.key]: {
                    "$eq": crossCheckResult.value(value)
                }
            };
        },
        "from": gte,
        "gte": gte,
        "to": lte,
        "lte": lte
    };
}
let service = async (content: type.content, schema: type.schema = null, option: type.option = null) => {
    let useOption = lo.merge(option, {
        prefix: "filter",
        validateKey: false
    });
    let operationConverter = operationConverterRaw(useOption, schema);

    let filter = [];
    for (let key of Object.keys(content)) {
        if (key.startsWith(useOption.prefix + ".")) {
            if (useOption.validateKey && !schema) {
                throw new Error("Key is not allowed");
            }
            let keyParts = key.split(".");
            if (keyParts.length == 2) {
                filter.push(
                    operationConverter["eq"](keyParts[1], content[key])
                );
            }
            else if (keyParts.length == 3) {
                let operation = keyParts[2];
                filter.push(
                    operationConverter[operation](keyParts[1], content[key])
                );
            }
        }
    }
    if (filter.length > 0) {
        return {
            "$and": filter
        };
    }
    else {
        return {};
    }

};
export default service;