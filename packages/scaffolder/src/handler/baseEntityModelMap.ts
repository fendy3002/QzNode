import * as debugRaw from 'debug';
let debug = debugRaw("@fendy3002/scaffolder:handler/baseEntityModelMap");
import entityMap from '../baseEntity/entityMap';
import {
    handler
} from '../crudAssignerType';

let baseEntityModelMap: handler.baseEntityModelMap = ({ baseEntityModel, sourceData, passAs, willMapAssociation, onSuccess }) => {
    return async ({ ...params }) => {
        let dataToMap = await sourceData(params);
        debug("sourceData", dataToMap);
        let mappedData = await entityMap.apiField({
            context: params,
            data: dataToMap,
            model: baseEntityModel,
            willMapAssociation
        });
        debug("mappedData", mappedData);
        return {
            ...params,
            [passAs]: mappedData,
            ...(await onSuccess?.({
                ...params,
                [passAs]: mappedData,
            }) ?? {})
        }
    };
};
export { baseEntityModelMap };