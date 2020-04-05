export namespace Table {
    export interface Column {
        header: () => any,
        body: (row) => any,
        startWidth?: number,
    };
    export interface State {
        columns: Column[]
        resizing: {
            columnIndex: number,
            rowIndex: number,
            width: number,
            height: number,
            xPos: number,
            yPos: number,
            direction: string
        }
        customRowHeight: {
            [index: number]: number
        }
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
        columns: Column[],
        toolbar: (data: ToolbarArgs) => any,
        rowHeight?: number,
        onChange: (changePayload: ChangeArgs) => void
    };
};
export namespace Pagination {
    export interface Props {
        limit ?: number,
        page: number,
        display ?: number,
        pageCount: number,
        paginationOption: number[]
    }
};
export namespace Toolbar {
    export interface Props {
        data?: any,
        body: (data: Table.ToolbarArgs) => any
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