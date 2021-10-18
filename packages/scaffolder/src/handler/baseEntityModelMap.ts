import * as httpErrors from "http-errors";
import entityMap from '../baseEntity/entityMap';
import {
    handler
} from '../crudAssignerType';

let baseEntityModelMap: handler.baseEntityModelMap = ({ baseEntityModel, sourceData, passAs, onSuccess }) => {
    return async ({ ...params }) => {
        let dataToMap = await sourceData(params);
        let mappedData = await entityMap.apiField({
            context: params,
            data: dataToMap,
            model: baseEntityModel
        });
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