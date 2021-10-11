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
    create?: {
        editable?: boolean,
        required?: boolean
    },
    update?: {
        editable?: boolean,
        required?: boolean
    }
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