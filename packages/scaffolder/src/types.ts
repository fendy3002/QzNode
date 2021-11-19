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
    none
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

export enum DataGeneratorFieldHint {
    fullName,
    firstName,
    lastName,
    email,
    address,
    text,
    brand,
    country,
    countrycode,

    timestampSecond,
    timestampMS,

    guid,
    nanoid,

};

export interface BaseEntityModel {
    entity(): BaseEntity,
    hasMany(model: BaseEntityModel, params: {
        as: string,
        relation: {
            parentKey: string,
            childKey: string,
        }[],
        required?: boolean
    }): void,
    hasOne(model: BaseEntityModel, params: {
        as: string,
        relation: {
            parentKey: string,
            childKey: string,
        }[],
        required?: boolean
    }): void,
    belongsTo(model: BaseEntityModel, params: {
        as: string,
        relation: {
            parentKey: string,
            childKey: string,
        }[],
        required?: boolean
    }): void,
    association(): {
        parent: ParentChildAssociation[],
        children: ParentChildAssociation[],
    }
};
export interface BaseEntityModelManager {
    addEntity: (baseEntity: BaseEntity) => void,
    addModel: (baseEntity: BaseEntityModel) => void,
    getModel: (baseEntityName: string) => BaseEntityModel,
    getModels: () => BaseEntityModel[],
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
    },
    dataGeneration?: {
        rowCount?: number,
    },
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
    dataGeneration?: {
        hint?: DataGeneratorFieldHint,
    },
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

export namespace DataGenerator {
    export interface Configuration {
        rowCount?: number,
    };
    export interface GeneratedID {
        data: any[]
    };
    export interface GeneratedIDSet {
        [entityName: string]: GeneratedID
    };
};