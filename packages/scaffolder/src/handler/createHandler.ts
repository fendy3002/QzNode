import {
    handler
} from '../crudAssignerType';

let createHandler: handler.createHandler = ({ sequelizeDb, modelName, getBody, onSuccess }) => {
    return async ({
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[modelName];
        let createPayload = await getBody?.({ req, validateResult, sqlTransaction, ...params })
            ?? validateResult?.data ?? req.body;

        let createOption = {};
        if (sqlTransaction) {
            createOption = {
                transaction: sqlTransaction
            };
        }
        const currentModuleData = await currentModuleModel.create(createPayload, createOption);
        return {
            ...params,
            req,
            validateResult,
            sqlTransaction,
            createdData: currentModuleData.toJSON(),
            ...await onSuccess({ req, validateResult, sqlTransaction, createdData: currentModuleData.toJSON(), ...params })
        };
    };
};

export { createHandler };