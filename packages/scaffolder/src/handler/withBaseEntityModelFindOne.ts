import * as httpErrors from "http-errors";
import { filterParser, sortParser } from "@fendy3002/express-helper";
import entityMap from '../baseEntity/entityMap';
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
            let { listData } = await findAll({
                sequelizeDb,
                modelName: association.childModel.entity().sqlName ?? association.childModel.entity().name,
                passAs: "listData",
                raw: true,
                modelParam: async (param) => { return {}; },
                onSuccess: async (param) => param,
            })(params);
            viewData[association.as] = listData;
        }
        for (let association of associations.sibling) {
            let { viewData: siblingData } = await findOne({
                sequelizeDb,
                modelName: association.siblingModel.entity().sqlName ?? association.siblingModel.entity().name,
                passAs: "viewData",
                raw: true,
                whereClause: async (param) => {
                    return {
                        [association.siblingKey]: viewData[association.myKey]
                    };
                },
                onSuccess: async (param) => param,
            })(params);
            viewData[association.as] = siblingData;
        }

        return {
            [passAs]: viewData,
            ...await onSuccess({ ...params, [passAs]: viewData })
        };
    }
};
export { withBaseEntityModelFindOne };