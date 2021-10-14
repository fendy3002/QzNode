import listAssigner from '../basic/listAssigner';
import * as handler from '../../handler';
import {
    handler as handlerType
} from '../../crudAssignerType';
import {
    BaseEntityModel
} from '../../types';

export interface AssignParams {
    sequelizeDb: any,
    modelName: string,
    middleware?: any[],
    baseEntityModel: BaseEntityModel,
    beforeFetch?: handlerType.generalHandler,
    afterFetch?: handlerType.generalHandler,
};
export default {
    assign: (option: AssignParams, router) => {
        return listAssigner.assign({
            ...option,
            handler: handler.withBeforeAfter({
                before: option.beforeFetch,
                handle: handler.withBaseEntityModelFindAll({
                    modelName: option.modelName,
                    sequelizeDb: option.sequelizeDb,
                    passAs: "listData",
                    baseEntityModel: option.baseEntityModel,
                    raw: true,
                    onSuccess: option.afterFetch
                }),
                after: async ({ res, listData, ...params }) => {
                    res.status(200).json({
                        data: listData
                    });
                    return { res, listData, ...params };
                }
            })
        }, router);
    }
}