import {
    handler
} from '../crudAssignerType';

let updateHandler: handler.updateHandler = ({ sequelizeDb, modelName, getBody, whereClause, onSuccess }) => {
    return async ({
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[modelName];
        let updatePayload = await getBody?.({ req, validateResult, sqlTransaction, ...params })
            ?? validateResult?.data ?? req.body;

        let updateOption: any = {
            where: await whereClause({ req, validateResult, sqlTransaction, ...params })
        };
        if (sqlTransaction) {
            updateOption = {
                transaction: sqlTransaction
            };
        }
        await currentModuleModel.update(updatePayload, updateOption);
        return {
            ...await onSuccess({ req, validateResult, sqlTransaction, ...params })
        };
    };
};

export { updateHandler };