import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let returnOriginalParam: handler.returnOriginalParam = ({ handle }) => {
    return async ({ ...params }) => {
        await handle(params);
        return params;
    };
};
export { returnOriginalParam };