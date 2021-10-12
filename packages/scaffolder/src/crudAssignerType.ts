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
export interface SequelizeModelParam {
    sequelizeDb?: Sequelize.Sequelize,
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
    SequelizeModelParam,
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
        (param: SequelizeModelParam & {
            handle: generalHandler
        }): generalHandler
    };
    export interface createHandler {
        (param: {
            getBody: generalHandler,
            onSuccess: generalHandler,
        }): generalHandler
    };
    export interface updateHandler {
        (param: {
            getBody: generalHandler,
            whereClause: generalHandler,
            onSuccess: generalHandler,
        }): generalHandler
    };
    export interface deleteHandler {
        (param: {
            whereClause: generalHandler,
            onSuccess: generalHandler,
        }): generalHandler
    };
    export interface withBaseEntityValidation {
        (param: {
            baseEntity: types.BaseEntity,
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
    export interface withBaseEntityFindAll {
        (param: SequelizeModelParam & {
            raw?: boolean,
            baseEntity: types.BaseEntity,
            filterOption?: any,
            sortOption?: any,
            additionalFilter?: generalHandler,
            defaultSort?: any[],

            passAs: string,
            onSuccess: generalHandler
        }): generalHandler
    };

};