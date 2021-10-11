import { array } from "@fendy3002/qz-node";
import { errorHandler } from "@fendy3002/express-helper";
import httpErrors = require("http-errors");
import * as Sequelize from 'sequelize';
import * as debugRaw from 'debug';
const debug = debugRaw("app:routes/account/login");

export interface WhereClauseHandler {
    ({ req, res }): Promise<any>
};
export interface AssignParams {
    connectionName?: string,
    modelName: string,
    formCode?: string,
    formAction?: string,
    middleware?: any[],
    whereClause?: WhereClauseHandler
};
import hasAccessMiddleware from '../../middleware/hasAccess';
import * as types from "../../types";
export default (router, config: types.config.app) => {
    return {
        assign: (option: AssignParams) => {
            let middleware = option.middleware ?? [];
            if (option.formCode) {
                middleware = [
                    hasAccessMiddleware(config)(option.formCode, option.formAction ?? "IsDelete"),
                    ...middleware
                ];
            }
            router.delete("/:id", middleware,
                errorHandler.handled(async (req, res, next) => {
                    const currentModuleModel = req.sql(option.connectionName ?? "default").models[option.modelName];
                    const whereClause = (option.whereClause) ?
                        (await option.whereClause({ req, res })) :
                        {
                            RecordID: req.params.id,
                        };
                    if (!await currentModuleModel.findOne({
                        where: whereClause
                    })) {
                        return res.status(404).json({
                            message: "Data not found"
                        });
                    }
                    await currentModuleModel.destroy({
                        where: whereClause,
                    });
                    return res.status(200).json({
                        message: "ok"
                    });
                })
            );
        }
    }
};
