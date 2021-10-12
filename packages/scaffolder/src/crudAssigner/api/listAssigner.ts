import listAssigner from '../basic/listAssigner';
import * as handler from '../../handler';
import {
    handler as handlerType
} from '../../crudAssignerType';

export interface AssignParams {
    sequelizeDb: any,
    modelName: string,
    middleware?: any[],
    handler?: handlerType.generalHandler,
    modelParam?: handlerType.generalHandler
};
export default {
    assign: (option: AssignParams, router) => {
        return listAssigner.assign({
            ...option,
            handler: option.handler ?
                handler.withBeforeAfter({
                    handle: option.handler,
                    after: async ({ res, listData, ...params }) => {
                        res.status(200).json({
                            data: listData
                        });
                        return { res, listData, ...params };
                    }
                }) :
                handler.findAll({
                    modelName: option.modelName,
                    sequelizeDb: option.sequelizeDb,
                    passAs: "listData",
                    raw: true,
                    modelParam: option.modelParam,
                    onSuccess: async ({ res, listData, ...params }) => {
                        res.status(200).json({
                            data: listData
                        });
                        return { res, listData, ...params };
                    }
                })
        }, router);
    }
}