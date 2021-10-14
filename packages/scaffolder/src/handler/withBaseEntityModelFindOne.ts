import { array } from "@fendy3002/qz-node";
import { findOne } from './findOne';
import { findAll } from './findAll';
import {
    handler
} from '../crudAssignerType';

let withBaseEntityModelFindOne: handler.withBaseEntityModelFindOne = ({ sequelizeDb,
    passAs, whereClause, baseEntityModel, onSuccess }) => {
    return async ({ ...params }) => {
        let { viewData } = await findOne({
            sequelizeDb,
            modelName: baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name,
            raw: true,
            onSuccess: async (param) => param,
            passAs: "viewData",
            whereClause: whereClause[baseEntityModel.entity().sqlName ?? baseEntityModel.entity().name]
        })(params);

        let associations = baseEntityModel.association();
        for (let association of associations.children) {
            let whereClause = array.toSet(association.relation, k => viewData[k.parentKey], k => k.childKey);

            let childEntityName = association.childModel.entity().name;
            const childModelName = association.childModel.entity().sqlName ?? association.childModel.entity().name;
            if (association.many) {
                let { listData } = await findAll({
                    sequelizeDb,
                    modelName: childModelName,
                    passAs: "listData",
                    raw: true,
                    modelParam: whereClause[childEntityName] ?? (async (param) => {
                        return {
                            where: whereClause
                        };
                    }),
                    onSuccess: async (param) => param,
                })(params);
                viewData[association.as] = listData;
            } else {
                let { viewData: siblingData } = await findOne({
                    sequelizeDb,
                    modelName: childModelName,
                    passAs: "viewData",
                    raw: true,
                    whereClause: whereClause[childEntityName] ?? (async (param) => {
                        return whereClause;
                    }),
                    onSuccess: async (param) => param,
                })(params);
                viewData[association.as] = siblingData;
            }
        }

        return {
            ...params,
            [passAs]: viewData,
            ...await onSuccess({ ...params, [passAs]: viewData })
        };
    }
};
export { withBaseEntityModelFindOne };