import {
    ValidateResultParam,
    BaseHandlerParam,
    SqlTransactionParam,
    SequelizeModelParam
} from '../crudAssignerType';

export interface Param extends
    SequelizeModelParam,
    BaseHandlerParam,
    SqlTransactionParam,
    ValidateResultParam {
    getBody: (param: BaseHandlerParam & ValidateResultParam & SqlTransactionParam) => Promise<any>
}
export default async ({
    sequelizeDb,
    sqlTransaction,
    modelName,
    getBody,
    context,
    req,
    res,
    validateResult
}: Param) => {
    const currentModuleModel = sequelizeDb.models[modelName];
    let createPayload = await getBody?.({ sqlTransaction, context, validateResult, req, res })
        ?? validateResult?.data ?? req.body;

    let createOption = {};
    if (sqlTransaction) {
        createOption = {
            transaction: sqlTransaction
        };
    }
    const currentModuleData = await currentModuleModel.create(createPayload, createOption);
    return currentModuleData;
};