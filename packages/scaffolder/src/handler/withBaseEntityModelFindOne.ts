import { array } from "@fendy3002/qz-node";
import { findOne } from './findOne';
import { findAll } from './findAll';
import {
    handler
} from '../crudAssignerType';

let withBaseEntityModelFindOne: handler.withBaseEntityModelFindOne = ({ sequelizeDb,
    passAs, whereClause, baseEntityModel, onSuccess }) => {

    return async ({ ...params }) => {
        let get = async ({ whereClause, entityName, modelName, as, many, associationModel }) => {
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
                result[as] = await Promise.all(
                    listData.map(async k => {
                        return {
                            ...k,
                            ...await processAssociation({
                                associations: associationModel.entity().association(),
                                viewData: k
                            })
                        };
                    })
                );
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
                result[as] = {
                    ...childViewData,
                    ...await processAssociation({
                        associations: associationModel.entity().association(),
                        viewData: childViewData
                    })
                };
            }
            return result;
        };
        let processAssociation = async ({ associations, viewData }) => {
            let result: any = {};
            for (let association of associations.parent) {
                let whereClause = array.toSet(association.relation, k => k.childKey, k => viewData[k.parentKey]);
                let parentEntityName = association.parentModel.entity().parent;
                const parentModelName = association.parentModel.entity().sqlName ?? association.parentModel.entity().name;
                result = {
                    ...await get({
                        as: association.as,
                        many: association.many,
                        associationModel: association.parentModel,
                        entityName: parentEntityName,
                        whereClause: whereClause,
                        modelName: parentModelName
                    })
                };
            }
            for (let association of associations.children) {
                let whereClause = array.toSet(association.relation, k => viewData[k.parentKey], k => k.childKey);

                let childEntityName = association.childModel.entity().name;
                const childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
                result = {
                    ...await get({
                        as: association.as,
                        many: association.many,
                        associationModel: association.childModel,
                        entityName: childEntityName,
                        whereClause: whereClause,
                        modelName: childModelName
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
        viewData = {
            ...viewData,
            ...await processAssociation({ associations: associations, viewData: viewData })
        };

        return {
            ...params,
            [passAs]: viewData,
            ...await onSuccess({ ...params, [passAs]: viewData })
        };
    }
};
export { withBaseEntityModelFindOne };