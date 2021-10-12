import { error } from '@fendy3002/qz-node';
import {
    SqlTransactionParam,
    SequelizeModelParam
} from '../crudAssignerType';

export interface Param extends
    SequelizeModelParam {
    handler: (param: SequelizeModelParam & SqlTransactionParam) => Promise<any>
};
export default async ({ sequelizeDb, modelName, handler }: Param) => {
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