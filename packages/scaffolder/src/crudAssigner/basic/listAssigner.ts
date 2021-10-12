import { array } from "@fendy3002/qz-node";
import { filterParser, sortParser, errorHandler } from "@fendy3002/express-helper";
import httpErrors = require("http-errors");
import * as debugRaw from 'debug';
const debug = debugRaw("app:routes/account/login");

export interface SchemaHandler {
    (params: { req, res }): Promise<any>
};
export interface AdditionalFilterHandler {
    (params: { req, res }): Promise<any>
};
export interface FilterSortOption {
    validateKey: boolean,
    notFoundKeyError: boolean,
};
export interface AssignParams {
    connectionName?: string,
    modelName: string,
    middleware?: any[],
    formCode?: string,
    formAction?: string,
    additionalFilter?: AdditionalFilterHandler,
    filterSchema?: SchemaHandler,
    filterOption?: FilterSortOption,
    sortSchema?: SchemaHandler,
    sortOption?: FilterSortOption,
    defaultSort?: any[]
};
import hasAccessMiddleware from '../../middleware/hasAccess';
import * as types from "../../types";
export default (router, config: types.config.app) => {
    return {
        assign: (option: AssignParams) => {
            let middleware = option.middleware ?? [];
            if (option.formCode) {
                middleware = [
                    hasAccessMiddleware(config)(option.formCode, option.formAction ?? "IsDisplay"),
                    ...middleware
                ];
            }
            router.get("/", middleware,
                errorHandler.handled(async (req, res, next) => {
                    const currentModuleModel = req.sql(option.connectionName ?? "default").models[option.modelName];
                    let page_limit = parseInt(req.query.page_limit ?? "25");
                    let page = parseInt(req.query.page ?? "1");

                    let filterSchema = option.filterSchema ? await option.filterSchema({ req, res }) : {};
                    let filter = await filterParser.sequelize(req.query, filterSchema,
                        option.filterOption ?? {
                            validateKey: false,
                            notFoundKeyError: false,
                        });
                    filter = {
                        ...filter,
                        ...(option.additionalFilter ? await option.additionalFilter({ req, res }) : {})
                    };
                    let sortSchema = option.sortSchema ? await option.sortSchema({ req, res }) : {};
                    let sortBy = await sortParser.sequelize(req.query, sortSchema,
                        option.sortOption ?? {
                            notFoundKeyError: false,
                            validateKey: false
                        }).array();

                    let responseData = await currentModuleModel.findAll({
                        where: filter,
                        raw: true,
                        order: sortBy ?? option.defaultSort ?? [["AtTimeStamp", "DESC"]],
                        limit: page_limit,
                        offset: (page - 1) * page_limit,
                    });

                    return res.status(200).json({
                        data: responseData
                    });
                })
            );
        }
    }
};
