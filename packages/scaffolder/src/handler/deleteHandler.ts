import {
    handler
} from '../crudAssignerType';

let deleteHandler: handler.deleteHandler = ({ sequelizeDb, modelName, whereClause, onSuccess }) => {
    return async ({
        req,
        validateResult,
        sqlTransaction,
        ...params
    }) => {
        const currentModuleModel = sequelizeDb.models[modelName];
        let deleteOption: any = {
            where: await whereClause({ req, validateResult, sqlTransaction, ...params })
        };
        if (sqlTransaction) {
            deleteOption = {
                transaction: sqlTransaction
            };
        }
        await currentModuleModel.destroy(deleteOption);
        return {
            ...params,
            req,
            validateResult,
            sqlTransaction,
            ...await onSuccess({ req, validateResult, sqlTransaction, ...params })
        };
    };
};

export { deleteHandler };