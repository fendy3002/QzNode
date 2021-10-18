import dataTypeMap from './dataTypeMap';
import * as types from '../types';

let mapRecord = async ({
    model, record, context
}) => {
    let schema: any = {};
    for (let fieldName of Object.keys(model.entity().fields)) {
        let field = model.entity().fields[fieldName];
        let fieldValue = record[fieldName];
        schema = {
            ...schema,
            ...await dataTypeMap.apiField({
                model: model,
                data: record,
                context: context,
                field: field,
                fieldName: fieldName,
                fieldValue: fieldValue
            })
        };
    }
    let association = model.association();
    for (let each of association.children) {
        let childAssociation: types.ParentChildAssociation = each;
        let childModel = childAssociation.childModel;
        schema = {
            ...schema,
            [childAssociation.as]: await mapModel({
                model: childModel,
                context,
                data: record[childAssociation.as]
            })
        };
    }
    for (let each of association.parent) {
        let parentAssociation: types.ParentChildAssociation = each;
        let parentModel = parentAssociation.parentModel;
        schema = {
            ...schema,
            [parentAssociation.as]: await mapModel({
                model: parentModel,
                context,
                data: record[parentAssociation.as]
            })
        };
    }
    return schema;
};

let mapModel = async ({
    model, data, context
}) => {
    if (!data) { return null; }

    if (Array.isArray(data)) {
        return await Promise.all(data.map(async k => {
            return await mapRecord({
                context,
                model,
                record: k
            });
        }))
    } else {
        return await mapRecord({
            context,
            model,
            record: data
        });
    }
};

export default mapModel;