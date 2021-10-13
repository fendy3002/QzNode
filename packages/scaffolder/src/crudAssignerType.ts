import * as types from './types';
import * as Sequelize from 'sequelize';
export interface ValidateResult {
    isValid: boolean,
    data: any,
    message?: string
};

export interface BaseHandlerParam {
    context: any,
    req: any,
    res: any
};
export interface SequelizeInstanceParam {
    sequelizeDb?: Sequelize.Sequelize,
};
export interface SequelizeModelParam extends SequelizeInstanceParam {
    modelName?: string
};
export interface ValidateResultParam {
    validateResult?: ValidateResult,
};
export interface SqlTransactionParam {
    sqlTransaction?: any,
};
export interface OperationDataParam {
    createdData?: any,
    originalData?: any,
    updatedData?: any,
    listData?: any,
    viewData?: any
};

export interface UnifiedParam extends
    BaseHandlerParam,
    ValidateResultParam,
    SqlTransactionParam,
    OperationDataParam {
}

export enum Action {
    create = "create",
    update = "update"
};

export namespace handler {
    export interface generalHandler {
        (param: UnifiedParam): Promise<any>
    };

    export interface withSqlTransaction {
        (param: SequelizeInstanceParam & {
            handle: generalHandler
        }): generalHandler
    };
    export interface baseEntityModelCreateHandler {
        (param: SequelizeInstanceParam & {
            baseEntityModel: types.BaseEntityModel,
            sourceBody: generalHandler,
            onSuccess: generalHandler,
            getBody: {
                [modelName: string]: (param: UnifiedParam & { sourceBody: any }) => Promise<any>
            }
        }): generalHandler
    }
    export interface createHandler {
        (param: SequelizeModelParam & {
            getBody: generalHandler,
            onSuccess: generalHandler,
        }): generalHandler
    };
    export interface updateHandler {
        (param: SequelizeModelParam & {
            getBody: generalHandler,
            whereClause: generalHandler,
            onSuccess: generalHandler,
        }): generalHandler
    };
    export interface deleteHandler {
        (param: SequelizeModelParam & {
            whereClause: generalHandler,
            onSuccess: generalHandler,
        }): generalHandler
    };
    export interface withBaseEntityModelValidation {
        (param: {
            baseEntityModel: types.BaseEntityModel,
            action: Action,
            onValid: (param: BaseHandlerParam & ValidateResultParam) => Promise<any>
        }): generalHandler
    };
    export interface withBeforeAfter {
        (param: {
            before?: generalHandler,
            handle: generalHandler,
            after?: generalHandler,
        }): generalHandler
    };
    export interface prepareUpload {
        (param: {
            fields: { name: string, maxCount: number }[],
            onSave: (param: UnifiedParam & {
                files
            }) => Promise<any>
        }): generalHandler
    };
    export interface findOne {
        (param: SequelizeModelParam & {
            raw?: boolean,
            whereClause: generalHandler
            passAs: string,
            onSuccess: generalHandler
        }): generalHandler
    };
    export interface findAll {
        (param: SequelizeModelParam & {
            raw?: boolean,
            modelParam: generalHandler,

            passAs: string,
            onSuccess: generalHandler
        }): generalHandler
    };
    export interface withBaseEntityModelFindAll {
        (param: SequelizeModelParam & {
            raw?: boolean,
            baseEntityModel: types.BaseEntityModel,
            filterOption?: any,
            sortOption?: any,
            additionalFilter?: generalHandler,
            defaultSort?: any[],

            passAs: string,
            onSuccess: generalHandler
        }): generalHandler
    };

};