import * as Sequelize from 'sequelize';

import * as createAssignerType from '../basic/createAssigner';
import * as updateAssignerType from '../basic/updateAssigner';
import * as listAssignerType from '../basic/listAssigner';
import * as viewAssignerType from '../basic/viewAssigner';
import * as deleteAssignerType from '../basic/deleteAssigner';

import basic from '../basic';
import * as handler from '../../handler';
import * as crudAssignerType from '../../crudAssignerType';

export interface BaseParam {
    sequelizeDb: Sequelize.Sequelize,
    modelName: string,
    middleware?: any[],
};
export interface AssignParams {
    view?: viewAssignerType.AssignParams & {
        whereClause: crudAssignerType.handler.generalHandler
    },
    list?: listAssignerType.AssignParams & {
        handler?: crudAssignerType.handler.generalHandler,
        modelParam?: crudAssignerType.handler.generalHandler
    },
    create?: createAssignerType.AssignParams & {
        handler: crudAssignerType.handler.generalHandler
    },
    update?: updateAssignerType.AssignParams & {
        handler: crudAssignerType.handler.generalHandler
    },
    delete?: deleteAssignerType.AssignParams & {
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