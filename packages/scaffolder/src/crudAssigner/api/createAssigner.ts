import { errorHandler } from "@fendy3002/express-helper";
import * as multer from 'multer';
import * as debugRaw from 'debug';
const debug = debugRaw("app:routes/account/login");

export interface ValidateResult {
    isValid: boolean,
    data: any,
    message?: string
};

export interface BaseHandlerParam {
    context: any,
    req: any,
    res: any
};
export interface ValidateResultParam {
    validateResult?: ValidateResult,
};
export interface SqlTransactionParam {
    sqlTransaction: any,
};
export interface CreatedDataParam {
    createdData: any
};
export interface ValidateHandler {
    (param: BaseHandlerParam): Promise<ValidateResult>
};
export interface GetBodyHandler {
    (param: BaseHandlerParam & ValidateResultParam & SqlTransactionParam): Promise<any>
};

export interface AssignParams {
    sequelizeDb: any,
    modelName: string,
    middleware?: any[],
    validation?: ValidateHandler,
    upload?: {
        fileSizeLimit?: number,
        fields: { name: string, maxCount: number }[],
        onUpload: (param: BaseHandlerParam & CreatedDataParam & { files }) => Promise<void>,
    },

    onBeforeInsert?: (param: BaseHandlerParam & ValidateResultParam) => Promise<void>,
    transaction: {
        onBeforeInsert?: (param: BaseHandlerParam & SqlTransactionParam & ValidateResultParam) => Promise<void>,
        getBody?: GetBodyHandler,
        onSuccess?: (param: BaseHandlerParam & SqlTransactionParam & CreatedDataParam) => Promise<void>
    },
    onSuccess?: (param: BaseHandlerParam & CreatedDataParam) => Promise<void>
    responseData?: (param: BaseHandlerParam & CreatedDataParam) => Promise<any>,
};
import * as types from "../../types";
export default {
    assign: (option: AssignParams, router) => {
        let middleware = option.middleware ?? [];
        if (option.upload?.fields.length > 0) {
            let upload = multer({
                dest: '/tmp/', limits: {
                    fileSize: option.upload.fileSizeLimit ?? (1024 * 1024 * 20) // default 20 mb
                }
            });
            middleware = [
                ...middleware,
                upload.fields(option.upload.fields)
            ];
        }

        router.post("/", middleware,
            errorHandler.handled(async (req, res, next) => {
                let sqldb = option.sequelizeDb;
                const currentModuleModel = sqldb.models[option.modelName];

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
                await option.onBeforeInsert?.({ context, validateResult, req, res });

                let sqlTransaction = await sqldb.transaction();
                let responseData = null;
                try {
                    await option.transaction.onBeforeInsert?.({ sqlTransaction, context, validateResult, req, res });
                    let createPayload = await option.transaction.getBody?.({ sqlTransaction, context, validateResult, req, res })
                        ?? validateResult?.data ?? req.body;
                    const currentModuleData = await currentModuleModel.create(createPayload, {
                        transaction: sqlTransaction
                    });
                    responseData = currentModuleData.toJSON();

                    await option.transaction.onSuccess?.({ sqlTransaction, context, createdData: responseData, req, res });
                    await sqlTransaction.commit();
                } catch (ex) {
                    await sqlTransaction.rollback();
                }

                if (option.upload && req.files) {
                    let files: any = {};
                    for (let prop of option.upload.fields.map(k => k.name)) {
                        files[prop] = req.files[prop];
                    }
                    await option.upload.onUpload({
                        createdData: responseData, context, files, req, res
                    });
                }
                await option.onSuccess?.({ context, createdData: responseData, req, res });
                responseData = await option.responseData?.({ context, createdData: responseData, req, res }) ?? responseData;

                return res.status(200).json({
                    data: responseData
                });
            })
        );
    }
}