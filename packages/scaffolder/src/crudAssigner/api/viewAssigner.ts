import viewAssigner from '../basic/viewAssigner';
import * as handler from '../../handler';
import {
    handler as handlerType
} from '../../crudAssignerType';
import {
    BaseEntityModel
} from '../../types';

export interface AssignParams {
    sequelizeDb: any,
    baseEntityModel: BaseEntityModel,
    middleware?: any[],
    whereClause: {
        [modelName: string]: handlerType.generalHandler
    },
    maxDepth ?: number,
    beforeFetch?: handlerType.generalHandler,
    afterFetch?: handlerType.generalHandler,
};
export default {
    assign: (option: AssignParams, router) => {
        return viewAssigner.assign({
            ...option,
            handler: handler.withBeforeAfter({
                before: option.beforeFetch,
                handle: handler.withBaseEntityModelFindOne({
                    baseEntityModel: option.baseEntityModel,
                    whereClause: option.whereClause,
                    sequelizeDb: option.sequelizeDb,
                    passAs: "viewData",
                    maxDepth: option.maxDepth ?? 2,
                    onSuccess: option.afterFetch ?? (async (param) => param)
                }),
                after: async ({ res, viewData, ...params }) => {
                    res.status(200).json({
                        data: viewData
                    });
                    return { res, viewData, ...params };
                }
            }),
        }, router);
    }
}