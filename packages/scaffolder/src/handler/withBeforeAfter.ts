import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let withBeforeAfter: handler.withBeforeAfter = ({ before, handle, after }) => {
    return async ({ ...params }) => {
        let beforeParams = await before?.({ ...params }) ?? params;
        let handleParams = await handle({ ...beforeParams }) ?? params;
        return await after?.({ ...handleParams }) ?? params;
    };
};
export { withBeforeAfter };