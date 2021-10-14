import { array } from "@fendy3002/qz-node";
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
        for (let association of associations.children) {
            // if (association.type == "parentChild" && association.direction == "child") {
            let childrenSourceBody = updateSourceBody[association.as];
            let childEntityName = association.childModel.entity().name;
            let childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
            let whereClause = array.toSet(association.relation, k => currentModuleData[k.parentKey], k => k.childKey);
            if (association.many) {
                let childrenToInsert = [];
                for (let each of childrenSourceBody) {
                    for (let eachRelation of association.relation) {
                        each[eachRelation.childKey] = currentModuleData[eachRelation.parentKey];
                    }
                    childrenToInsert.push(await getBody[childEntityName]?.({ ...generalHandlerParam, sourceBody: each }));
                }
                await sequelizeDb.models[childModelName]
                    .destroy({
                        ...updateOption,
                        where: whereClause
                    });
                let createResult = await sequelizeDb.models[childModelName]
                    .bulkCreate(
                        childrenToInsert,
                        updateOption
                    );
                currentModuleData[association.as] = createResult.map(k => k.toJSON());
            } else {
                for (let eachRelation of association.relation) {
                    childrenSourceBody[eachRelation.childKey] = currentModuleData[eachRelation.parentKey];
                }
                let childUpdatePayload = await getBody[childEntityName]?.({ ...generalHandlerParam, sourceBody: childrenSourceBody });
                await sequelizeDb.models[childModelName]
                    .update(
                        childUpdatePayload,
                        {
                            ...updateOption,
                            where: whereClause
                        }
                    );
                currentModuleData[association.as] = await sequelizeDb.models[childModelName]
                    .findOne({
                        raw: true,
                        ...updateOption,
                        where: whereClause
                    });
            }
        }

        return {
            updatedData: currentModuleData,
            ...await onSuccess({ req, validateResult, sqlTransaction, updatedData: currentModuleData, ...params })
        };
    };
};

export { baseEntityModelUpdateHandler };