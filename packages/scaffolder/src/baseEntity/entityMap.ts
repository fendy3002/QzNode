import * as Sequelize from 'sequelize';

import dataTypeMap from './dataTypeMap';
import * as types from '../types';
export interface MapParam {
    entity: types.BaseEntity,
    action?: string,
    db?: Sequelize.Sequelize
};
export default {
    sequelizeMySql: async ({
        entity,
        db
    }: MapParam) => {
        let modelName = entity.sqlName ?? entity.name;
        if (db.models[modelName]) {
            // if already defined, return defined model
            return db.models[modelName];
        }
        let fields: any = {};
        for (let propName of Object.keys(entity.fields)) {
            fields = {
                ...fields,
                ...await dataTypeMap.sequelizeMySql({
                    entity: entity,
                    field: entity.fields[propName],
                    fieldName: propName
                })
            };
        }

        const model = db.define(modelName, fields, {
            tableName: modelName,
            timestamps: false
        });
        return model;
    },
    validateJSON: async ({
        entity, action
    }: MapParam) => {
        let properties: any = {};
        for (let propName of Object.keys(entity.fields)) {
            properties = {
                ...properties,
                ...await dataTypeMap.validateJSON({
                    entity: entity,
                    field: entity.fields[propName],
                    fieldName: propName,
                    action: action
                })
            };
        }

        return {
            type: "object",
            properties: properties
        };
    }
};