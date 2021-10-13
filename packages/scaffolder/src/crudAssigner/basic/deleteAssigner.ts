import { errorHandler } from "@fendy3002/express-helper";
import {
    handler
} from '../../crudAssignerType';

export interface AssignParams {
    middleware?: any[],
    handler: handler.generalHandler
};
export default {
    assign: (option: AssignParams, router) => {
        let middleware = option.middleware ?? [];
        router.delete("/:id", middleware,
            errorHandler.handled(async (req, res, next) => {
                let context: any = {};
                await option.handler({
                    context,
                    req,
                    res,
                });
            })
        );
    }
}