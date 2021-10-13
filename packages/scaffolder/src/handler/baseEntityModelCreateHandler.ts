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

        let createOption = {};
        if (sqlTransaction) {
            createOption = {
                transaction: sqlTransaction
            };
        }
        let createPayload = await getBody[baseEntityModel.entity().name]?.({ ...generalHandlerParam, sourceBody: createSourceBody });
        let currentModuleData: any = await currentModuleModel.create(createPayload, createOption);
        currentModuleData = currentModuleData.toJSON();

        let associations = baseEntityModel.association();
        for (let association of [...associations.children, ...associations.parent, ...associations.sibling]) {
            if (association.type == "parentChild" && association.direction == "child") {
                let childrenSourceBody = createSourceBody[association.as];
                let childrenToInsert = [];
                for (let each of childrenSourceBody) {
                    each[association.childKey] = currentModuleData[association.parentKey];
                    childrenToInsert.push(await getBody[baseEntityModel.entity().name]?.({ ...generalHandlerParam, sourceBody: each }));
                }
                let childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
                let createResult = await sequelizeDb.models[childModelName]
                    .bulkCreate(
                        childrenToInsert,
                        createOption
                    );
                currentModuleData[association.as] = createResult;
            } else if (association.type == "sibling") {
                let siblingSourceBody = createSourceBody[association.as];
                siblingSourceBody[association.siblingKey] = currentModuleData[association.myKey];
                let siblingCreatePayload = await getBody[baseEntityModel.entity().name]?.({ ...generalHandlerParam, sourceBody: siblingSourceBody });
                let siblingModelName = association.siblingModel.entity().sqlName ?? association.siblingModel.entity().name;
                let createResult = await sequelizeDb.models[siblingModelName]
                    .create(
                        siblingCreatePayload,
                        createOption
                    );
                currentModuleData[association.as] = createResult;
            }
        }

        return {
            createdData: currentModuleData,
            ...await onSuccess({ req, validateResult, sqlTransaction, createdData: currentModuleData.toJSON(), ...params })
        };
    };
};

export { baseEntityModelCreateHandler };