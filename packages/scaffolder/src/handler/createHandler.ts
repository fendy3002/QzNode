import {
    handler
} from '../crudAssignerType';

let service: handler.createHandler = async ({
    sequelizeDb,
    sqlTransaction,
    modelName,
    getBody,
    context,
    req,
    res,
    validateResult
}) => {
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
export default service;