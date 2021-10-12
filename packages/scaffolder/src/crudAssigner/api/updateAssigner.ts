import { errorHandler } from "@fendy3002/express-helper";
import * as multer from 'multer';
import {
    handler
} from '../../crudAssignerType';

export interface AssignParams {
    sequelizeDb: any,
    modelName: string,
    middleware?: any[],

    upload?: {
        fileSizeLimit?: number,
        fields: { name: string, maxCount: number }[],
    },
    handler: handler.generalHandler
};
export default {
    assign: (option: AssignParams, router) => {
        let middleware = option.middleware ?? [];
        if (option.upload?.fields.length > 0) {
            let upload = multer({
                dest: '/tmp/', limits: {
                    fileSize: option.upload.fileSizeLimit ?? (1024 * 1024 * 20) // default 20 mb
                }
            });
            middleware = [
                ...middleware,
                upload.fields(option.upload.fields)
            ];
        }

        router.put("/:id", middleware,
            errorHandler.handled(async (req, res, next) => {
                let context: any = {};
                await option.handler({
                    context,
                    req,
                    res,
                    sequelizeDb: option.sequelizeDb,
                    modelName: option.modelName,
                });
            })
        );
    }
};