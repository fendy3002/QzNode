import * as httpErrors from "http-errors";
import { filterParser, sortParser } from "@fendy3002/express-helper";
import entityMap from '../baseEntity/entityMap';
import { findAll } from './findAll';
import {
    handler
} from '../crudAssignerType';

let withBaseEntityFindAll: handler.withBaseEntityFindAll = ({ sequelizeDb, modelName,
    raw, passAs, filterOption, sortOption, defaultSort,
    additionalFilter, baseEntity, onSuccess }) => {
    return findAll({
        sequelizeDb,
        modelName,
        modelParam: async ({ req, ...params }) => {
            let page_limit = parseInt(req.query.page_limit ?? "25");
            let page = parseInt(req.query.page ?? "1");

            let filterSchema = await entityMap.filterParser({ entity: baseEntity });
            let filter = await filterParser.sequelize(req.query, filterSchema,
                {
                    validateKey: true,
                    notFoundKeyError: true,
                    ...filterOption
                });
            filter = {
                ...filter,
                ...await additionalFilter?.({ req, ...params })
            };
            let sortSchema = await entityMap.sortParser({ entity: baseEntity });
            let sortBy = await sortParser.sequelize(req.query, sortSchema,
                {
                    notFoundKeyError: true,
                    validateKey: true,
                    ...sortOption
                }).array();

            return {
                where: filter,
                order: sortBy ?? defaultSort,
                limit: page_limit,
                offset: (page - 1) * page_limit,
            };
        },
        onSuccess,
        passAs,
        raw
    })
};
export { withBaseEntityFindAll };