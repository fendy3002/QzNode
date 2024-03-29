import { validator } from '@fendy3002/qz-node';
import * as Sequelize from 'sequelize';

import * as types from '../types';
export interface MapParam {
    model: types.BaseEntityModel,
    field: types.BaseEntityField,
    fieldName: string,
    action?: string
};
export default {
    sequelizeMySql: async ({
        model, field, fieldName
    }: MapParam) => {
        let result: any = {};
        if (field.autoIncrement) {
            result.autoIncrement = true;
        }
        if (field.primaryKey) {
            result.primaryKey = true;
        }

        if (field.dataType == types.BaseEntityDataType.bigint) {
            result.type = Sequelize.BIGINT;
        } else if (field.dataType == types.BaseEntityDataType.integer) {
            result.type = Sequelize.INTEGER;
        } else if (field.dataType == types.BaseEntityDataType.smallint) {
            result.type = Sequelize.SMALLINT;
        } else if (field.dataType == types.BaseEntityDataType.tinyint) {
            result.type = Sequelize.TINYINT;
        } else if (field.dataType == types.BaseEntityDataType.decimal) {
            if (!field.length) {
                result.type = Sequelize.DECIMAL;
            } else {
                result.type = Sequelize.DECIMAL(field.length, field.decimalScale);
            }
        } else if (field.dataType == types.BaseEntityDataType.text) {
            result.type = Sequelize.TEXT;
        } else if (field.dataType == types.BaseEntityDataType.guid) {
            result.type = Sequelize.CHAR(36);
        } else if (field.dataType == types.BaseEntityDataType.date) {
            result.type = Sequelize.DATEONLY;
        } else if (field.dataType == types.BaseEntityDataType.char) {
            if (!field.length) {
                result.type = Sequelize.CHAR;
            } else {
                result.type = Sequelize.CHAR(field.length);
            }
        } else if (field.dataType == types.BaseEntityDataType.string) {
            if (!field.length) {
                result.type = Sequelize.STRING;
            } else {
                result.type = Sequelize.STRING(field.length);
            }
        } else if (field.dataType == types.BaseEntityDataType.boolean) {
            result.type = Sequelize.BOOLEAN;
        }

        return {
            [field.sqlName ?? fieldName]: result
        };
    },
    validateJSON: async ({
        model, field, fieldName, action
    }: MapParam) => {
        if (!field[action]?.editable) {
            return null;
        }
        let propField: any = {};
        if (field.dataType == types.BaseEntityDataType.bigint) {
            propField.type = "number";
            if (field.length) {
                propField.max = field.length;
            }
        } else if (field.dataType == types.BaseEntityDataType.integer) {
            propField.type = "number";
        } else if (field.dataType == types.BaseEntityDataType.smallint) {
            propField.type = "number";
        } else if (field.dataType == types.BaseEntityDataType.tinyint) {
            propField.type = "number";
        } else if (field.dataType == types.BaseEntityDataType.decimal) {
            propField.type = "number";
        } else if (field.dataType == types.BaseEntityDataType.text) {
            propField.type = "string";
            if (field.length) {
                propField.maxLength = field.length;
            }
        } else if (field.dataType == types.BaseEntityDataType.guid) {
            propField.type = "string";
            propField.maxLength = 36;
        } else if (field.dataType == types.BaseEntityDataType.date) {
            propField.type = "string";
        } else if (field.dataType == types.BaseEntityDataType.char) {
            propField.type = "string";
            if (field.length) {
                propField.maxLength = field.length;
            }
        } else if (field.dataType == types.BaseEntityDataType.string) {
            propField.type = "string";
            if (field.length) {
                propField.maxLength = field.length;
            }
        } else if (field.dataType == types.BaseEntityDataType.boolean) {
            propField.type = "boolean";
        }
        if (field[action]?.required) {
            propField.required = true;
        }

        return {
            [field.sqlName ?? fieldName]: propField
        };
    },
    filterParser: async ({
        model, field, fieldName
    }) => {
        let result: any = {};

        if ([
            types.BaseEntityDataType.bigint,
            types.BaseEntityDataType.tinyint,
            types.BaseEntityDataType.decimal,
            types.BaseEntityDataType.smallint,
            types.BaseEntityDataType.integer,
        ].some(k => k == field.dataType)) {
            result = {
                [fieldName]: { key: fieldName, type: "number" },
            };
        } else if ([
            types.BaseEntityDataType.text,
            types.BaseEntityDataType.guid,
            types.BaseEntityDataType.char,
            types.BaseEntityDataType.string,
        ].some(k => k == field.dataType)) {
            result = {
                [fieldName]: fieldName,
            };
        } else if (field.dataType == types.BaseEntityDataType.date) {
            result = {
                [fieldName]: {
                    key: fieldName,
                    type: "date",
                    formatTo: "YYYY-MM-DD HH:mm:ss",
                    endOfDay: true
                }
            };
        } else if (field.dataType == types.BaseEntityDataType.boolean) {
            result = {
                [fieldName]: { key: fieldName, type: "boolean" },
            };
        }

        return result;
    },
    apiField: async ({
        model, field, fieldName, data, fieldValue, context
    }) => {
        let baseEntityField = (field as types.BaseEntityField);
        if (!(baseEntityField.api?.isDisplayed ?? true)) {
            return {};
        }
        if (baseEntityField.api?.responseConverter) {
            return {
                [fieldName]: await baseEntityField.api?.responseConverter({
                    context: context,
                    data: data,
                    fieldValue: fieldValue,
                    schemaModel: model,
                    schemaField: field
                })
            };
        } else {
            if (baseEntityField.dataType == types.BaseEntityDataType.boolean) {
                let booleanValue: boolean = null;
                if (fieldValue == "1" || fieldValue == "true") {
                    booleanValue = true;
                } else if (fieldValue == "0" || fieldValue == "false") {
                    booleanValue = false;
                }
                return {
                    [fieldName]: booleanValue
                };
            } else if ([
                types.BaseEntityDataType.bigint,
                types.BaseEntityDataType.tinyint,
                types.BaseEntityDataType.decimal,
                types.BaseEntityDataType.smallint,
                types.BaseEntityDataType.integer,
            ].some(k => k == field.dataType)) {
                if (validator.native.isNumeric(fieldValue)) {
                    return {
                        [fieldName]: fieldValue
                    };
                } else if (fieldValue != null) {
                    return {
                        [fieldName]: parseFloat(fieldValue)
                    };
                } else {
                    return {
                        [fieldName]: fieldValue
                    };
                }
            } else {
                return {
                    [fieldName]: fieldValue
                };
            }
        }
    },
};