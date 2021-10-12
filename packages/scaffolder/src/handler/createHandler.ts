import {
    handler
} from '../crudAssignerType';

let createHandler: handler.createHandler = ({ getBody, onSuccess }) => {
    return async ({
        sequelizeDb,
        modelName,
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[modelName];
        let createPayload = await getBody?.({ sequelizeDb, modelName, req, validateResult, sqlTransaction, ...params })
            ?? validateResult?.data ?? req.body;

        let createOption = {};
        if (sqlTransaction) {
            createOption = {
                transaction: sqlTransaction
            };
        }
        const currentModuleData = await currentModuleModel.create(createPayload, createOption);
        await onSuccess({ sequelizeDb, modelName, req, validateResult, sqlTransaction, createdData: currentModuleData.toJSON(), ...params });
    };
};

export { createHandler };