import * as httpErrors from "http-errors";
import {
    handler
} from '../crudAssignerType';

let findAll: handler.findAll = ({ sequelizeDb, modelName, raw, passAs, modelParam, onSuccess }) => {
    return async ({ sqlTransaction, ...params }) => {
        let additionalOption: any = {};
        if (sqlTransaction) {
            additionalOption.transaction = sqlTransaction;
        }

        let data = await sequelizeDb.models[modelName].findAll({
            ...await modelParam({ sqlTransaction, ...params }),
            raw: raw ?? true,
            ...additionalOption
        });
        return {
            sqlTransaction,
            ...params,
            [passAs]: data,
            ...await onSuccess({ ...params, sqlTransaction, [passAs]: data })
        };
    };
};
export { findAll };