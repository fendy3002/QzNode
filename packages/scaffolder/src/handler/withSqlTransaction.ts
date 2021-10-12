import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let service: handler.withSqlTransaction = async ({ sequelizeDb, modelName, handler }) => {
    let sqlTransaction = await sequelizeDb.transaction({ autocommit: false });
    try {
        let handlerResponse = await handler({ sequelizeDb, modelName, sqlTransaction });
        await sqlTransaction.commit();
        return handlerResponse;
    } catch (ex) {
        await sqlTransaction.rollback();
        throw error.rethrow.from(ex).original().asIs();
    }
};
export default service;