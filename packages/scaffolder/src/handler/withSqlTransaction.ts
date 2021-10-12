import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let withSqlTransaction: handler.withSqlTransaction = ({ sequelizeDb, modelName, handle }) => {
    return async ({ ...params }) => {
        let sqlTransaction = await sequelizeDb.transaction({ autocommit: false });
        try {
            let handlerResponse = await handler({ sequelizeDb, sqlTransaction, modelName, ...params });
            await sqlTransaction.commit();
            return handlerResponse;
        } catch (ex) {
            await sqlTransaction.rollback();
            throw error.rethrow.from(ex).original().asIs();
        }
    };
};
export { withSqlTransaction };