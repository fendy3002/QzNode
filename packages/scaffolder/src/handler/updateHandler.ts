import {
    handler
} from '../crudAssignerType';

let updateHandler: handler.updateHandler = ({ getBody, whereClause, onSuccess }) => {
    return async ({
        sequelizeDb,
        modelName,
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[modelName];
        let updatePayload = await getBody?.({ sequelizeDb, modelName, req, validateResult, sqlTransaction, ...params })
            ?? validateResult?.data ?? req.body;

        let updateOption: any = {
            where: await whereClause({ sequelizeDb, modelName, req, validateResult, sqlTransaction, ...params })
        };
        if (sqlTransaction) {
            updateOption = {
                transaction: sqlTransaction
            };
        }
        await currentModuleModel.update(updatePayload, updateOption);
        return {
            ...await onSuccess({ sequelizeDb, modelName, req, validateResult, sqlTransaction, ...params })
        };
    };
};

export { updateHandler };