import * as Sequelize from 'sequelize';
import basic from '../basic';
import * as handler from '../../handler';
import * as crudAssignerType from '../../crudAssignerType';

export interface BaseParam {
    sequelizeDb: Sequelize.Sequelize,
    modelName: string,
    middleware?: any[],
};
export interface AssignParams {
    view?: BaseParam & {
        whereClause: crudAssignerType.handler.generalHandler
    },
    list?: BaseParam & {
        handler?: crudAssignerType.handler.generalHandler,
        modelParam?: crudAssignerType.handler.generalHandler
    },
    create?: BaseParam & {
        handler: crudAssignerType.handler.generalHandler
    },
    update?: BaseParam & {
        handler: crudAssignerType.handler.generalHandler
    },
    delete?: BaseParam & {
        handler: crudAssignerType.handler.generalHandler
    },
};

let api = async (option: AssignParams, router) => {
    return await basic.assign({
        view: option.view ? {
            ...option.view,
            handler: handler.findOne({
                raw: true,
                modelName: option.view.modelName,
                whereClause: option.view.whereClause,
                sequelizeDb: option.view.sequelizeDb,
                passAs: "viewData",
                onSuccess: async ({ res, viewData, ...params }) => {
                    res.status(200).json({
                        data: viewData
                    });
                    return { res, viewData, ...params };
                }
            }),
        } : null,
        list: option.list ? {
            ...option.list,
            handler: option.list.handler ?? handler.findAll({
                modelName: option.list.modelName,
                sequelizeDb: option.list.sequelizeDb,
                passAs: "listData",
                raw: true,
                modelParam: option.list.modelParam,
                onSuccess: async ({ res, listData, ...params }) => {
                    res.status(200).json({
                        data: listData
                    });
                    return { res, listData, ...params };
                }
            })
        } : null,
        create: option.create ? {
            ...option.create,
            handler: handler.withBeforeAfter({
                handle: option.create.handler,
                after: async ({ res, createdData, ...params }) => {
                    res.status(200).json({
                        data: createdData
                    });
                    return { res, createdData, ...params };
                }
            })
        } : null,
        update: option.update ? {
            ...option.update,
            handler: handler.withBeforeAfter({
                handle: option.create.handler,
                after: async ({ res, updatedData, ...params }) => {
                    res.status(200).json({
                        data: updatedData
                    });
                    return { res, updatedData, ...params };
                }
            })
        } : null,
        delete: option.delete ? {
            ...option.update,
            handler: handler.withBeforeAfter({
                handle: option.create.handler,
                after: async ({ res, ...params }) => {
                    res.status(200).json({
                        message: "ok"
                    });
                    return { res, ...params };
                }
            })
        } : null,
    }, router);
};
export default api;