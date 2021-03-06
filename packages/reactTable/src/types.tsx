export namespace Table {
    export interface State {
        showFilter: boolean
    };
    export interface Props extends ListTable.Props {
        pagination: {
            limit?: number,
            page: number,
            display?: number,
            pageCount: number,
            paginationOption: number[],
            onChange: (evt: any) => void
        }
    };
};
export namespace ListTable {
    export interface ColumnProp {
        header: () => any,
        body: (row) => any,
        startWidth?: number,
        sort?: () => string
    };
    export interface State {
        resizing: {
            columnIndex: number,
            rowIndex: number,
            width: number,
            height: number,
            xPos: number,
            yPos: number,
            direction: string
        },
        customColumnWidth: {
            [index: number]: number
        },
        customRowHeight: {
            [index: number]: number
        },
        extendedRow: {
            [index: number]: number
        },
        hashData: string
    };
    export interface ToolbarArgs {
        data: any,
    };
    export interface ChangeArgs {
        page: number,
        limit: number,
        filter: any,
        sort: {
            [key: string]: string
        }
    };
    export interface Props {
        data: any[],
        columns: ColumnProp[],
        toolbar: (data: ToolbarArgs) => any,
        extensible?: (data: ToolbarArgs) => any,
        onExtend?: (data: ToolbarArgs) => void,
        rowHeight?: number,
        bodyHeight?: number,
        sort?: {
            [key: string]: string
        },
        onChange: (changePayload: ChangeArgs) => void
    };
};
export namespace Pagination {
    export interface Props {
        limit?: number,
        page: number,
        display?: number,
        pageCount: number,
        onClick: (evt: any) => void,
        onChange: (evt: any) => void,
        paginationOption: number[]
    }
};
export namespace Toolbar {
    export interface Props {
        data?: any,
        body: (data: ListTable.ToolbarArgs) => any
    };
};
export namespace ResizableDiv {
    export interface Props {
        width: number,
        height: number,
        body: any,
        data: {
            [key: string]: any
        },
        onClick?: any,
        onResizeStart: any,
        onResizeDrag: any,
        onResizeStop: any
    };
};