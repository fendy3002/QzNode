import updateAssigner from '../basic/updateAssigner';
import * as handler from '../../handler';
import {
    handler as handlerType
} from '../../crudAssignerType';

export interface AssignParams {
    middleware?: any[],

    upload?: {
        fileSizeLimit?: number,
        fields: { name: string, maxCount: number }[],
    },
    handler: handlerType.generalHandler
};
export default {
    assign: (option: AssignParams, router) => {
        return updateAssigner.assign({
            ...option,
            handler: handler.withBeforeAfter({
                handle: option.handler,
                after: async ({ res, updatedData, ...params }) => {
                    res.status(200).json({
                        data: updatedData
                    });
                    return { res, updatedData, ...params };
                }
            })
        }, router);
    }
}