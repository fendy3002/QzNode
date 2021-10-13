import deleteAssigner from '../basic/deleteAssigner';
import * as handler from '../../handler';
import {
    handler as handlerType
} from '../../crudAssignerType';

export interface AssignParams {
    middleware?: any[],
    handler: handlerType.generalHandler
};
export default {
    assign: (option: AssignParams, router) => {
        return deleteAssigner.assign({
            ...option,
            handler: handler.withBeforeAfter({
                handle: option.handler,
                after: async ({ res, ...params }) => {
                    res.status(200).json({
                        message: "ok"
                    });
                    return { res, ...params };
                }
            })
        }, router);
    }
}