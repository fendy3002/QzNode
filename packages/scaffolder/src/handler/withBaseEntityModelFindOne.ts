import { array } from "@fendy3002/qz-node";
import * as debugRaw from 'debug';
let debug = debugRaw("@fendy3002/scaffolder:handler/withBaseEntityModelFindOne");
import { findAll } from './findAll';
import {
    handler
} from '../crudAssignerType';

let withBaseEntityModelFindOne: handler.withBaseEntityModelFindOne = ({ sequelizeDb, maxDepth,
    passAs, whereClause, baseEntityModel, onSuccess }) => {

    maxDepth = maxDepth ?? 2;
    let fetchedAssociationKey: any = {};
    return async ({ ...params }) => {
        debug("maxDepth", maxDepth);

        let findOne = async ({ sqlTransaction, modelName, whereClause }) => {
            let additionalOption: any = {};
            if (sqlTransaction) {
                additionalOption.transaction = sqlTransaction;
            }

            let data = await sequelizeDb.models[modelName].findOne({
                where: await whereClause({ sqlTransaction, ...params }),
                raw: true,
                ...additionalOption
            });
            return data;
        };

        let get = async ({ whereClause, entityName, modelName, as, many, associationModel, depth }) => {
            debug("get", {
                modelName, 
                entityName,
                whereClause,
                as,
                many, 
                depth
            });
            let result: any = {};
            if (many) {
                let { listData } = await findAll({
                    sequelizeDb,
                    modelName: modelName,
                    passAs: "listData",
                    raw: true,
                    modelParam: whereClause[entityName] ?? (async (param) => {
                        return {
                            where: whereClause
                        };
                    }),
                    onSuccess: async (param) => param,
                })(params);
                
                if (depth < maxDepth) {
                    result[as] = await Promise.all(
                        listData.map(async k => {
                            return {
                                ...k,
                                ...await processAssociation({
                                    associations: associationModel.association(),
                                    viewData: k,
                                    depth: depth + 1
                                })
                            };
                        })
                    );
                } else {
                    result[as] = listData;
                }
                debug("get result[as]", result[as]);
            } else {
                let childViewData = await findOne({
                    modelName: modelName,
                    whereClause: whereClause[entityName] ?? (async (param) => {
                        return whereClause;
                    }),
                    sqlTransaction: params.sqlTransaction
                });
                if (!childViewData) {
                    return result;
                }

                if (depth < maxDepth) {
                    result[as] = {
                        ...childViewData,
                        ...await processAssociation({
                            associations: associationModel.association(),
                            viewData: childViewData,
                            depth: depth + 1
                        })
                    };
                } else {
                    result[as] = childViewData
                }
                debug("get result[as]", result[as]);
            }
            return result;
        };
        let processAssociation = async ({ associations, viewData, depth }) => {
            let result: any = {};
            for (let association of associations.parent) {
                let whereClause = array.toSet(association.relation, k => viewData[k.childKey], k => k.parentKey);
                let parentEntityName = association.parentModel.entity().parent;
                const parentModelName = association.parentModel.entity().sqlName ?? association.parentModel.entity().name;
                if (fetchedAssociationKey[parentEntityName] > 0 && depth > fetchedAssociationKey[parentEntityName]) {
                    continue;
                }
                fetchedAssociationKey[parentEntityName] = depth;
                result = {
                    ...await get({
                        as: association.as,
                        many: association.many,
                        associationModel: association.parentModel,
                        entityName: parentEntityName,
                        whereClause: whereClause,
                        modelName: parentModelName,
                        depth: depth
                    })
                };
            }
            for (let association of associations.children) {
                let whereClause = array.toSet(association.relation, k => viewData[k.parentKey], k => k.childKey);
                let childEntityName = association.childModel.entity().name;
                const childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
                debug("processAssociation", {
                    childEntityName,
                    "fetchedAssociationKey[childEntityName]": fetchedAssociationKey[childEntityName],
                    depth: depth
                });

                // already fetched on previous depth
                if (fetchedAssociationKey[childEntityName] > 0 && depth > fetchedAssociationKey[childEntityName]) {
                    continue;
                }
                fetchedAssociationKey[childEntityName] = depth;
                result = {
                    ...await get({
                        as: association.as,
                        many: association.many,
                        associationModel: association.childModel,
                        entityName: childEntityName,
                        whereClause: whereClause,
                        modelName: childModelName,
                        depth: depth
                    })
                };
            }
            return result;
        };
        let viewData = await findOne({
            sqlTransaction: params.sqlTransaction,
            modelName: baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name,
            whereClause: whereClause[baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name]
        });
        let associations = baseEntityModel.association();
        if (maxDepth > 0) {
            viewData = {
                ...viewData,
                ...await processAssociation({ associations: associations, viewData: viewData, depth: 1 })
            };
        }

        return {
            ...params,
            [passAs]: viewData,
            ...await onSuccess({ ...params, [passAs]: viewData })
        };
    }
};
export { withBaseEntityModelFindOne };