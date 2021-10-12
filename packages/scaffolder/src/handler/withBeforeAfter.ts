import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let withBeforeAfter: handler.withBeforeAfter = ({ before, handle, after }) => {
    return async ({ ...params }) => {
        await before({ ...params });
        await handle({ ...params });
        await after({ ...params });
    };
};
export { withBeforeAfter };