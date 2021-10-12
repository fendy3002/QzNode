import {
    handler
} from '../crudAssignerType';

let deleteHandler: handler.deleteHandler = ({ whereClause, onSuccess }) => {
    return async ({
        sequelizeDb,
        modelName,
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[modelName];
        let deleteOption: any = {
            where: await whereClause({ sequelizeDb, modelName, req, validateResult, sqlTransaction, ...params })
        };
        if (sqlTransaction) {
            deleteOption = {
                transaction: sqlTransaction
            };
        }
        await currentModuleModel.destroy(deleteOption);
        return {
            ...await onSuccess({ sequelizeDb, modelName, req, validateResult, sqlTransaction, ...params })
        };
    };
};

export { deleteHandler };