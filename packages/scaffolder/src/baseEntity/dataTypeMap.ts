import * as Sequelize from 'sequelize';

import * as types from '../types';
export interface MapParam {
    entity: types.BaseEntity,
    field: types.BaseEntityField,
    fieldName: string,
    action?: string
};
export default {
    sequelizeMySql: async ({
        entity, field, fieldName
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
            result.type = Sequelize.TINYINT;
        }

        return {
            [field.sqlName ?? fieldName]: result
        };
    },
    validateJSON: async ({
        entity, field, fieldName, action
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
    }
};