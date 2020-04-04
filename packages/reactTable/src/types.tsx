export interface Anchor {
    Href: string,

};

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
    export interface Props {
        data: any[],
        columns: Column[]
        rowHeight?: number
    };
};
export namespace Toolbar {
    export interface Props {
        actions: {
            onClick: () => void,
            disabled ?: boolean,
            buttonType: string,
            body: () => any
        }[]
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