import * as httpErrors from "http-errors";
import {
    handler
} from '../crudAssignerType';

let findAll: handler.findAll = ({ sequelizeDb, modelName, raw, passAs, passCountAs, modelParam, onSuccess }) => {
    return async ({ sqlTransaction, ...params }) => {
        let additionalOption: any = {};
        if (sqlTransaction) {
            additionalOption.transaction = sqlTransaction;
        }

        let findAllParam = {
            ...await modelParam({ sqlTransaction, ...params }),
            raw: raw ?? true,
            ...additionalOption
        };
        let data = await sequelizeDb.models[modelName].findAll(findAllParam);
        let countParam = { ...findAllParam };
        if (countParam.order) { delete countParam.order; }
        if (countParam.limit) { delete countParam.limit; }
        if (countParam.offset) { delete countParam.offset; }
        let count = await sequelizeDb.models[modelName].count(countParam);

        return {
            sqlTransaction,
            ...params,
            [passAs ?? "listData"]: data,
            [passCountAs ?? "listTotalCount"]: count,
            ...await onSuccess({ ...params, sqlTransaction, [passAs ?? "listData"]: data })
        };
    };
};
export { findAll };