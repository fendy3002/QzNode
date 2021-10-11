import { array } from "@fendy3002/qz-node";
import { errorHandler, validator } from "@fendy3002/express-helper";
import httpErrors = require("http-errors");
import * as debugRaw from 'debug';
import * as multer from 'multer';
const debug = debugRaw("app:routes/account/login");
import * as Sequelize from 'sequelize';

export interface ValidateResult {
    isValid: boolean,
    data: any,
    message?: string
};
export interface ValidateHandler {
    (param: {
        context: any,
        req: any,
        res: any
    }): Promise<ValidateResult>
};
export interface BodyClauseHandler {
    (param: {
        context: any,
        validateResult?: ValidateResult,
        req: any,
        res: any
    }): Promise<any>
};
export interface WhereClauseHandler {
    (param: {
        validateResult?: ValidateResult,
        req: any,
        res: any
    }): Promise<any>
};
export interface AssignParams {
    connectionName?: string,
    modelName: string,
    middleware?: any[],
    formCode?: string,
    formAction?: string,
    validation?: ValidateHandler,
    upload?: {
        fields: { name: string, maxCount: number }[],
        onUpload: ({ context, originalData, updatedData, files, req, res }) => Promise<void>,
    },
    responseData?: ({ context, originalData, updatedData, req, res }) => Promise<any>,
    bodyClause?: BodyClauseHandler,
    whereClause?: WhereClauseHandler,
    onSuccess?: ({ context, originalData, updatedData, req, res }) => Promise<void>
};
import hasAccessMiddleware from '../../middleware/hasAccess';
import * as types from "../../types";
export default (router, config: types.config.app) => {
    return {
        assign: (option: AssignParams) => {
            let middleware = option.middleware ?? [];
            if (option.upload?.fields.length > 0) {
                let upload = multer({
                    dest: '/tmp/', limits: {
                        fileSize: config.upload.fileSizeLimit
                    }
                });
                middleware = [
                    ...middleware,
                    upload.fields(option.upload.fields)
                ];
            }
            if (option.formCode) {
                middleware = [
                    hasAccessMiddleware(config)(option.formCode, option.formAction ?? "IsUpdate"),
                    ...middleware
                ];
            }
            router.put("/:id", middleware,
                errorHandler.handled(async (req, res, next) => {
                    const currentModuleModel = req.sql(option.connectionName ?? "default").models[option.modelName];
                    let context: any = {};

                    let validateResult = null;
                    if (option.validation) {
                        validateResult = await option.validation({
                            context, req, res
                        });
                        if (!validateResult.isValid) {
                            return res.status(400).json({
                                message: validateResult.message
                            });
                        }
                    }
                    const whereClause = (option.whereClause) ?
                        (await option.whereClause({ validateResult, req, res })) :
                        {
                            RecordID: req.params.id,
                            OperationCode: {
                                [Sequelize.Op.not]: "D"
                            }
                        };
                    const originalData = await currentModuleModel.findOne({
                        where: whereClause,
                        raw: true
                    });
                    if (!originalData) {
                        return res.status(404).json({
                            message: "Data not found"
                        });
                    }
                    await currentModuleModel.update((option.bodyClause ?
                        await option.bodyClause({ context, validateResult, req, res }) :
                        {
                            ...(validateResult ? validateResult.data : req.body),
                            AtTimeStamp: new Date().getTime(),
                            OperationCode: "U",
                            UserKey: req.auth.user.RecordID,
                        }), {
                        where: whereClause,
                    });

                    let responseData = await currentModuleModel.findOne({
                        where: whereClause,
                        raw: true
                    });
                    if (option.upload) {
                        let files: any = {};
                        for (let prop of option.upload.fields.map(k => k.name)) {
                            files[prop] = req.files[prop];
                        }
                        await option.upload.onUpload({
                            originalData, updatedData: responseData, context, files, req, res
                        });
                    }
                    if (option.onSuccess) {
                        await option.onSuccess({
                            context, originalData: originalData,
                            updatedData: responseData, req, res
                        });
                    }
                    if (option.responseData) {
                        await option.responseData({
                            context, originalData: originalData,
                            updatedData: responseData, req, res
                        });
                    }

                    return res.status(200).json({
                        data: responseData
                    });
                })
            );
        }
    }
};
