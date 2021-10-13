import {
    handler,
} from '../crudAssignerType';

let baseEntityModelUpdateHandler: handler.baseEntityModelUpdateHandler = ({
    sequelizeDb, baseEntityModel,
    baseWhereClause,
    sourceBody, getBody, onSuccess
}) => {
    return async ({
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name];
        let generalHandlerParam = { req, validateResult, sqlTransaction, ...params };

        let updateSourceBody = await sourceBody?.(generalHandlerParam)
            ?? validateResult?.data ?? req.body;

        let updateOption = {};
        if (sqlTransaction) {
            updateOption = {
                transaction: sqlTransaction
            };
        }
        let updatePayload = await getBody[baseEntityModel.entity().name]?.({ ...generalHandlerParam, sourceBody: updateSourceBody });
        await currentModuleModel.update(updatePayload, {
            ...updateOption,
            where: await baseWhereClause(generalHandlerParam)
        });
        let currentModuleData = await currentModuleModel.findOne({
            ...updateOption,
            raw: true,
            where: await baseWhereClause(generalHandlerParam)
        });

        let associations = baseEntityModel.association();
        for (let association of [...associations.children, ...associations.parent, ...associations.sibling]) {
            if (association.type == "parentChild" && association.direction == "child") {
                let childrenSourceBody = updateSourceBody[association.as];
                let childrenToInsert = [];
                let childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
                for (let each of childrenSourceBody) {
                    each[association.childKey] = currentModuleData[association.parentKey];
                    childrenToInsert.push(await getBody[childModelName]?.({ ...generalHandlerParam, sourceBody: each }));
                }
                await sequelizeDb.models[childModelName]
                    .destroy({
                        ...updateOption,
                        where: {
                            [association.childKey]: currentModuleData[association.parentKey]
                        }
                    });
                let createResult = await sequelizeDb.models[childModelName]
                    .bulkCreate(
                        childrenToInsert,
                        updateOption
                    );
                currentModuleData[association.as] = createResult;
            } else if (association.type == "sibling") {
                let siblingSourceBody = updateSourceBody[association.as];
                siblingSourceBody[association.siblingKey] = currentModuleData[association.myKey];
                let siblingModelName = association.siblingModel.entity().sqlName ?? association.siblingModel.entity().name;
                let siblingUpdatePayload = await getBody[siblingModelName]?.({ ...generalHandlerParam, sourceBody: siblingSourceBody });
                await sequelizeDb.models[siblingModelName]
                    .update(
                        siblingUpdatePayload,
                        {
                            ...updateOption,
                            where: {
                                [association.siblingKey]: currentModuleData[association.myKey]
                            }
                        }
                    );
                currentModuleData[association.as] = await sequelizeDb.models[siblingModelName]
                    .findOne({
                        raw: true,
                        ...updateOption,
                        where: {
                            [association.siblingKey]: currentModuleData[association.myKey]
                        }
                    });
            }
        }

        return {
            createdData: currentModuleData,
            ...await onSuccess({ req, validateResult, sqlTransaction, createdData: currentModuleData, ...params })
        };
    };
};

export { baseEntityModelUpdateHandler };