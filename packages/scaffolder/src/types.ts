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
export enum BaseFieldGuiType {
    hidden,
    text,
    textarea,
    number,
    checkbox,
    fixedSelect,
    modelSelect,
    selectAsync,
    file,
    date,
};

export interface BaseEntityModel {
    entity: () => BaseEntity,
    hasMany: (model: BaseEntityModel, params: {
        as: string,
        relation: {
            parentKey: string,
            childKey: string,
        }[]
    }) => void,
    hasOne: (model: BaseEntityModel, params: {
        as: string,
        relation: {
            parentKey: string,
            childKey: string,
        }[]
    }) => void,
    belongsTo: (model: BaseEntityModel, params: {
        as: string,
        relation: {
            parentKey: string,
            childKey: string,
        }[]
    }) => void,
    association: () => {
        parent: ParentChildAssociation[],
        children: ParentChildAssociation[],
    }
};
export interface ParentChildAssociation {
    direction: 'child' | 'parent',
    many: boolean,
    parentModel: BaseEntityModel,
    childModel: BaseEntityModel,
    key: string,
    as: string,
    required: boolean,
    relation: {
        parentKey: string,
        childKey: string,
    }[]
};

export interface BaseEntity {
    name: string,
    sqlName?: string,

    fields: {
        [field: string]: BaseEntityField
    },
    gui?: {
        viewFolder: string,
        listFileName?: string,
        viewFileName?: string,
        createFileName?: string,
        updateFileName?: string,
        deleteFileName?: string,
    }
};

export interface BaseEntityField {
    sqlName?: string,
    dataType: BaseEntityDataType,
    decimalScale?: number,
    primaryKey?: boolean,
    autoIncrement?: boolean,
    length?: number,
    gui?: BaseFieldGui,
    api?: BaseFieldApi,
    create?: {
        editable?: boolean,
        required?: boolean
    },
    update?: {
        editable?: boolean,
        required?: boolean
    }
};

export interface BaseFieldApi {
    name?: string,
    isDisplayed?: boolean | ((param: {
        schemaModel: BaseEntityModel,
        schemaField: BaseEntityField,
        data: any,
        fieldValue: any,
        context: any
    }) => Promise<boolean>),
    responseConverter?: ((param: {
        schemaModel: BaseEntityModel,
        schemaField: BaseEntityField,
        data: any,
        fieldValue: any,
        context: any
    }) => Promise<any>),
};

export interface BaseFieldGui {
    name?: string,
    display?: string,
    type: BaseFieldGuiType,
    fieldOrder?: number,
    isRowBreakAfter?: boolean,
    isFullColumn?: boolean,

    fixedSelect?: {
        options: { label: string, value: string }[],
    },
    modelSelect?: {
        modelName: string,
        value: (data: any) => Promise<string>,
        label: (data: any) => Promise<string>,
    },
    selectAsync?: {
        labelField: string,
    },
    date?: {
        sourceType: string
    },
    number?: {
        fixedDecimal?: number
    }
};