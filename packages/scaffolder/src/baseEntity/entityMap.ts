import * as Sequelize from 'sequelize';

import dataTypeMap from './dataTypeMap';
import * as types from '../types';
export interface MapParam {
    model: types.BaseEntityModel,
    action?: string,
    db?: Sequelize.Sequelize
};
export default {
    sequelizeMySql: async ({
        model,
        db
    }: MapParam) => {
        let modelName = model.entity().sqlName ?? model.entity().name;
        if (db.models[modelName]) {
            // if already defined, return defined model
            return db.models[modelName];
        }
        let fields: any = {};
        for (let propName of Object.keys(model.entity().fields)) {
            fields = {
                ...fields,
                ...await dataTypeMap.sequelizeMySql({
                    model: model,
                    field: model.entity().fields[propName],
                    fieldName: propName
                })
            };
        }

        const sequelizeModel = db.define(modelName, fields, {
            tableName: modelName,
            timestamps: false
        });
        return sequelizeModel;
    },
    validateJSON: async ({
        model, action
    }: MapParam) => {
        let properties: any = {};
        for (let propName of Object.keys(model.entity().fields)) {
            properties = {
                ...properties,
                ...await dataTypeMap.validateJSON({
                    model: model,
                    field: model.entity().fields[propName],
                    fieldName: propName,
                    action: action
                })
            };
        }
        let associations = model.association();
        for (let association of associations.children) {
            let childProperties: any = {};
            for (let propName of Object.keys(association.childModel.entity().fields)) {
                childProperties = {
                    ...childProperties,
                    ...await dataTypeMap.validateJSON({
                        model: association.childModel,
                        field: association.childModel.entity().fields[propName],
                        fieldName: propName,
                        action: action
                    })
                };
            }

            if (association.many) {
                properties[association.as] = {
                    type: "array",
                    items: {
                        type: "object",
                        properties: childProperties
                    }
                };
            } else {
                properties[association.as] = {
                    type: "object",
                    properties: childProperties
                };
            }
        }

        return {
            type: "object",
            properties: properties
        };
    },
    filterParser: async ({
        model
    }: MapParam) => {
        let schema: any = {};
        for (let propName of Object.keys(model.entity().fields)) {
            schema = {
                ...schema,
                ...await dataTypeMap.filterParser({
                    model: model,
                    field: model.entity().fields[propName],
                    fieldName: propName,
                })
            };
        }
        return schema;
    },
    sortParser: async ({
        model
    }: MapParam) => {
        let schema: any = {};
        for (let propName of Object.keys(model.entity().fields)) {
            schema = {
                ...schema,
                [propName]: propName
            };
        }
        return schema;
    },
};