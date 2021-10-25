import * as debugRaw from 'debug';
let debug = debugRaw("@fendy3002/scaffolder:handler/baseEntityModelCreateHandler");
import {
    handler,
} from '../crudAssignerType';

let baseEntityModelCreateHandler: handler.baseEntityModelCreateHandler = ({ sequelizeDb, baseEntityModel, sourceBody, getBody, onSuccess }) => {
    return async ({
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name];
        let generalHandlerParam = { req, validateResult, sqlTransaction, ...params };

        let createSourceBody = await sourceBody?.(generalHandlerParam)
            ?? validateResult?.data ?? req.body;
        debug("createSourceBody", JSON.stringify(createSourceBody));

        let createOption = {};
        if (sqlTransaction) {
            createOption = {
                transaction: sqlTransaction
            };
        }
        let createPayload = await getBody[baseEntityModel.entity().name]?.({ ...generalHandlerParam, sourceBody: createSourceBody });
        let currentModuleData: any = await currentModuleModel.create(createPayload, createOption);
        currentModuleData = currentModuleData.toJSON();
        debug("currentModuleData", JSON.stringify(currentModuleData))
        let associations = baseEntityModel.association();
        for (let association of associations.children) {
            let childrenSourceBody = createSourceBody[association.as];
            debug(association.key + ".sourceBody", JSON.stringify(childrenSourceBody));

            let childEntityName = association.childModel.entity().name;
            let childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
            if (association.many && childrenSourceBody && childrenSourceBody?.length > 0) {
                let childrenToInsert = [];
                for (let each of childrenSourceBody) {
                    for (let eachRelation of association.relation) {
                        each[eachRelation.childKey] = currentModuleData[eachRelation.parentKey];
                    }
                    childrenToInsert.push(await getBody[childEntityName]?.({ ...generalHandlerParam, sourceBody: each }));
                }
                let createResult = await sequelizeDb.models[childModelName]
                    .bulkCreate(
                        childrenToInsert,
                        createOption
                    );
                currentModuleData[association.as] = createResult.map(k => k.toJSON());
            } else if (childrenSourceBody && !Array.isArray(childrenSourceBody)) {
                for (let eachRelation of association.relation) {
                    childrenSourceBody[eachRelation.childKey] = currentModuleData[eachRelation.parentKey];
                }
                let childCreatePayload = await getBody[childEntityName]?.({ ...generalHandlerParam, sourceBody: childrenSourceBody });
                let createResult = await sequelizeDb.models[childModelName]
                    .create(
                        childCreatePayload,
                        createOption
                    );
                currentModuleData[association.as] = createResult;
            } else if (association.required) {
                throw new Error(`Property '${association.as}' is required`);
            }
        }

        return {
            ...params,
            req,
            validateResult,
            sqlTransaction,
            createdData: currentModuleData,
            ...await onSuccess({ req, validateResult, sqlTransaction, createdData: currentModuleData, ...params })
        };
    };
};

export { baseEntityModelCreateHandler };