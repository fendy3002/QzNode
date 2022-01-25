export interface RowObject {
    cell: (columnCode: string) => {
        v: any
    }
};
export interface SheetObject {
    name: string,
    row: (row: number) => RowObject,
    readAllRows: ReadAllRows
};

export interface ReadAllRowsSchema {
    [fieldKey: string]: string | {
        (row: RowObject): any
    }
};
export interface ReadAllRowsOption {
    rowHasNext?: (row: RowObject) => boolean,
    skipRow?: number
};
export interface ReadAllRowsRecord {
    _row: number,
    _excelRow: number,
    [key: string]: any
};
export interface ReadAllRows {
    (schema: ReadAllRowsSchema, option?: ReadAllRowsOption): Promise<Array<any>>
};

export interface QzExcel {
    wb: any,
    getSheets: () => SheetObject[],
    getSheetByName: (name: string) => SheetObject,
};