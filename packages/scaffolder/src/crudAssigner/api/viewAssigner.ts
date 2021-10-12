import viewAssigner from '../basic/viewAssigner';
import * as handler from '../../handler';
import {
    handler as handlerType
} from '../../crudAssignerType';

export interface AssignParams {
    sequelizeDb: any,
    modelName: string,
    middleware?: any[],
    whereClause: handlerType.generalHandler
};
export default {
    assign: (option: AssignParams, router) => {
        return viewAssigner.assign({
            ...option,
            handler: handler.findOne({
                raw: true,
                modelName: option.modelName,
                whereClause: option.whereClause,
                sequelizeDb: option.sequelizeDb,
                passAs: "viewData",
                onSuccess: async ({ res, viewData, ...params }) => {
                    res.status(200).json({
                        data: viewData
                    });
                    return { res, viewData, ...params };
                }
            }),
        }, router);
    }
}