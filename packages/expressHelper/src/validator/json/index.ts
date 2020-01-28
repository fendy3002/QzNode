const jsonSchema = require('jsonschema').Validator;

import * as native from '../native';
export interface ValidateResult<T> {
    isValid: boolean,
    data: T,
    errors: {
        property: string,
        message: string,
        name: string
    }[]
};

export const schema = (schema: any) => {
    const validateObj = async (val: any, schema: any, path: string): Promise<ValidateResult<any>> => {
        let isValid = true;
        let errors: {
            property: string,
            message: string,
            name: string,
        }[] = [];
        let data: any = null;
        if (schema.type == "object") {
            data = {};
            for (let prop of Object.keys(schema.properties)) {
                let newPath = path + "." + prop;
                let validateResult = await validateObj(val[prop], schema.properties[prop], newPath);
                isValid = isValid && validateResult.isValid;
                errors = errors.concat(validateResult.errors);
                let propData = validateResult.data;
                if (schema.properties[prop].type == "string" &&
                    schema.required && schema.required.some(k => k == prop)) {
                    if (propData == "" || propData == null) {
                        isValid = false;
                        errors.push({
                            property: newPath,
                            name: schema.properties[prop].name ? schema.properties[prop].name : newPath,
                            message: "is required"
                        });
                    }
                    data[prop] = propData;
                }
                else if (schema.properties[prop].type == "string" && propData == null) {
                    if ((!schema.required || !schema.required.some(k => k == prop))
                        && !schema.properties[prop].required) {
                        data[prop] = "";
                    }
                    else {
                        data[prop] = propData;
                    }
                }
                else {
                    data[prop] = propData;
                }
            }
        }
        else if (schema.type == "array") {
            data = [];
            if (val && !Array.isArray(val)) {
                isValid = false;
                errors.push({
                    property: path,
                    name: schema.name ? schema.name : path,
                    message: "is not array"
                });
            }
            else {
                for (let each of val) {
                    let validateResult = await validateObj(each, schema.items, path)
                    isValid = isValid && validateResult.isValid;
                    errors = errors.concat(validateResult.errors);
                    data.push(validateResult.data);
                }
            }
        }
        else if (schema.type == "number") {
            isValid = native.isNumeric(val);
            if (!isValid) {
                errors.push({
                    property: path,
                    name: schema.name ? schema.name : path,
                    message: "is not a number"
                });
                data = null;
            }
            else {
                data = parseFloat(val);
            }
        }
        else if (schema.type == "integer") {
            isValid = native.isInteger(val);
            if (!isValid) {
                errors.push({
                    name: path,
                    property: schema.name ? schema.name : path,
                    message: "is not an integer"
                });
                data = null;
            }
            else {
                data = parseInt(val);
            }
        }
        else if (schema.type == "string") {
            data = val;
            if (schema.required) {
                if (data == null || data == "") {
                    isValid = false;

                    errors.push({
                        name: schema.name ? schema.name : path,
                        property: path,
                        message: "is required"
                    });
                }
            }
        }

        return {
            isValid,
            data: data,
            errors
        }
    };
    const validate = async <T>(val): Promise<ValidateResult<T>> => {
        let result = await validateObj(val, schema, "instance");
        if (result.isValid) {
            let jsonSchemaValidator = new jsonSchema();
            let jsonSchemaValidation = jsonSchemaValidator.validate(result.data, schema);
            if (jsonSchemaValidation.errors && jsonSchemaValidation.errors.length > 0) {
                result.isValid = false;
                result.errors = result.errors.concat(jsonSchemaValidation.errors.map(k => {
                    return {
                        property: k.property,
                        name: k.schema && k.schema.name ? k.schema.name : k.property,
                        message: k.message
                    };
                }))
            }
        }
        return result;
    };
    return {
        validate
    };
};