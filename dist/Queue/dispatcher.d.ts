import * as thisTypes from './types';
interface DispatcherParam {
    driver: string;
    connection: thisTypes.Connection;
    tableName: string;
    timezone: string;
}
declare let dispatcher: (param: DispatcherParam) => object;
export = dispatcher;
