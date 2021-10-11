export enum BaseEntityDataType {
    string,
    char,
    text,
    integer,
    bigint,
    tinyint,
    smallint,
    decimal,
    date,
    boolean,
    guid,
};

export interface BaseEntityField {
    sqlName?: string,
    dataType: BaseEntityDataType,
    decimalScale?: number,
    primaryKey?: boolean,
    autoIncrement?: boolean,
    length?: number,
    create?: {
        editable?: boolean,
        required?: boolean
    },
    update?: {
        editable?: boolean,
        required?: boolean
    }
};
export interface BaseEntity {
    name: string,
    sqlName?: string,

    fields: {
        [field: string]: BaseEntityField
    }
};