import createAssigner from '../basic/createAssigner';
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
        return createAssigner.assign({
            ...option,
            handler: handler.withBeforeAfter({
                handle: option.handler,
                after: async ({ res, createdData, ...params }) => {
                    res.status(200).json({
                        data: createdData
                    });
                    return { res, createdData, ...params };
                }
            })
        }, router);
    }
}