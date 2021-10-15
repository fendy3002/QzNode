import { array } from "@fendy3002/qz-node";
import { findOne } from './findOne';
import { findAll } from './findAll';
import {
    handler
} from '../crudAssignerType';

let withBaseEntityModelFindOne: handler.withBaseEntityModelFindOne = ({ sequelizeDb, maxDepth,
    passAs, whereClause, baseEntityModel, onSuccess }) => {

    maxDepth = maxDepth ?? 2;
    let fetchedAssociationKey: any = {};
    return async ({ ...params }) => {
        let get = async ({ whereClause, entityName, modelName, as, many, associationModel, depth }) => {
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
            } else {
                let { viewData: childViewData } = await findOne({
                    sequelizeDb,
                    modelName: modelName,
                    passAs: "viewData",
                    raw: true,
                    whereClause: whereClause[entityName] ?? (async (param) => {
                        return whereClause;
                    }),
                    onSuccess: async (param) => param,
                })(params);
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
        let { viewData } = await findOne({
            sequelizeDb,
            modelName: baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name,
            raw: true,
            onSuccess: async (param) => param,
            passAs: "viewData",
            whereClause: whereClause[baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name]
        })(params);
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