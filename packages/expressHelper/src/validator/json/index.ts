const jsonSchema = require('jsonschema').Validator;

import * as native from '../native';
export interface ValidateResult<T> {
    isValid: boolean,
    data: T,
    message: string[]
};

export const schema = (schema: any) => {
    const validateObj = async (val: any, schema: any, path: string): Promise<ValidateResult<any>> => {
        let isValid = true;
        let message: string[] = [];
        let data: any = null;
        if (schema.type == "object") {
            data = {};
            for (let prop of Object.keys(schema.properties)) {
                let newPath = path ? path + "." + prop : prop;
                let validateResult = await validateObj(val[prop], schema.properties[prop], newPath);
                isValid = isValid && validateResult.isValid;
                message = message.concat(validateResult.message);
                data[prop] = validateResult.data;
            }
        }
        else if (schema.type == "array") {
            data = [];
            if (val && !Array.isArray(val)) {
                isValid = false;
                message.push(path);
            }
            else {
                for (let each of val) {
                    let validateResult = await validateObj(each, schema.items, path)
                    isValid = isValid && validateResult.isValid;
                    message = message.concat(validateResult.message);
                    data.push(validateResult.data);
                }
            }
        }
        else if (schema.type == "number") {
            isValid = native.isNumeric(val);
            data = parseFloat(val);
            if (!isValid) {
                message.push(path);
            }
        }
        else if (schema.type == "integer") {
            isValid = native.isInteger(val);
            if (!isValid) {
                message.push(path);
                data = null;
            }
            else {
                data = parseInt(val);
            }
        }
        else if (schema.type == "string") {
            data = val;
        }

        return {
            isValid,
            data: data,
            message
        }
    };
    const validate = async <T>(val): Promise<ValidateResult<T>> => {
        let result = await validateObj(val, schema, "");
        if (result.isValid) {
            let jsonSchemaValidator = new jsonSchema();
            let jsonSchemaValidation = jsonSchemaValidator.validate(result.data, schema);
            if (jsonSchemaValidation.errors && jsonSchemaValidation.errors.length > 0) {
                result.isValid = false;
                result.message = result.message.concat(jsonSchemaValidator.errors.map(k => {
                    return k.property + " " + k.message;
                }))
            }
        }
        return result;
    };
    return {
        validate
    };
};