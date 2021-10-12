import * as httpErrors from "http-errors";
import {
    handler
} from '../crudAssignerType';

let findOne: handler.findOne = ({ sequelizeDb, modelName, raw, passAs, whereClause, onSuccess }) => {
    return async ({ sqlTransaction, ...params }) => {
        let additionalOption: any = {};
        if (sqlTransaction) {
            additionalOption.transaction = sqlTransaction;
        }

        let data = await sequelizeDb.models[modelName].findOne({
            where: await whereClause({ sqlTransaction, ...params }),
            raw: raw ?? true,
            ...additionalOption
        });
        if (!data) {
            throw httpErrors(500, "Data not found");
        }
        return {
            [passAs]: data,
            ...await onSuccess({ ...params, sqlTransaction, [passAs]: data })
        };
    };
};
export { findOne };