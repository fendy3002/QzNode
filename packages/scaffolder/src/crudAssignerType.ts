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
    sequelizeDb: Sequelize.Sequelize,
    modelName?: string
};
export interface ValidateResultParam {
    validateResult?: ValidateResult,
};
export interface SqlTransactionParam {
    sqlTransaction?: any,
};
export interface CreatedDataParam {
    createdData?: any
};

export interface UnifiedParam extends
    BaseHandlerParam,
    SequelizeModelParam,
    ValidateResultParam,
    SqlTransactionParam,
    CreatedDataParam {

}

export enum Action {
    create = "create",
    update = "update"
};

export namespace handler {
    export interface withSqlTransaction {
        (param: SequelizeModelParam & {
            handler: (param: UnifiedParam) => Promise<any>
        }): (param: UnifiedParam) => Promise<any>
    };
    export interface createHandler {
        (param: {
            getBody: (param: UnifiedParam) => Promise<any>
        }): (param: UnifiedParam) => Promise<any>
    };
    export interface withBaseEntityValidation {
        (param: {
            baseEntity: types.BaseEntity,
            action: Action,
            onValid: (param: BaseHandlerParam & ValidateResultParam) => Promise<any>
        }): (param: UnifiedParam) => Promise<any>
    };
};