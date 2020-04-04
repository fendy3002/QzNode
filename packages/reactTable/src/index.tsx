const React = require('react');
const lo = require('lodash');
const { DraggableCore } = require('react-draggable');

interface State {
    Columns: TableColumn[]
    Resizing: {
        ColumnIndex: number,
        RowIndex: number,
        Width: number,
        Height: number,
        XPos: number,
        YPos: number,
        Direction: string
    }
    CustomRowHeight: {
        [index: number]: number
    }
};
interface TableColumn {
    Header: () => any,
    Body: (row) => any,
    StartWidth: 60,

}
interface TableProps {
    data: any[],
    Columns: TableColumn[]
    RowHeight: number
}

class Table extends React.Component<TableProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            Columns: [],
            CustomRowHeight: {},
            Resizing: {
                ColumnIndex: null,
                RowIndex: null,
                Width: null,
                Height: null,
                XPos: null,
                YPos: null,
                Direction: null,
            },
        };
        [
            "resizeDrag",
            "resizeStart",
            "resizeStop",
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    static getDerivedStateFromProps(props, state) {
        let returnState = {
            ...state
        };
        if (state.Columns.length != props.Columns.length) {
            returnState.Columns = props.Columns.map(k => {
                return {
                    ...k,
                    width: k.StartWidth
                };
            });
        }
        return returnState;
    }
    resizeStart(evt) {
        const colIndex = evt.currentTarget.dataset.col;
        const rowIndex = evt.currentTarget.dataset.row;
        const direction = evt.currentTarget.dataset.direction;
        const xPos = evt.clientX;
        const yPos = evt.clientY;

        this.setState((state) => {
            return {
                Resizing: {
                    ColumnIndex: colIndex,
                    RowIndex: rowIndex,
                    Width: state.Columns[colIndex].width,
                    Height: (this.state.CustomRowHeight[rowIndex] || this.props.RowHeight),
                    XPos: xPos,
                    YPos: yPos,
                    Direction: direction,
                }
            };
        });
    }
    resizeDrag(evt) {
    }
    resizeStop(evt) {
        let resizeHandler = this.state.Resizing;
        const xPos = evt.clientX;
        const yPos = evt.clientY;

        let newState: any = {
            Resizing: {
                ColumnIndex: null,
                RowIndex: null,
                Width: null,
                Height: null,
                XPos: null,
                YPos: null,
                Direction: null,
            }
        };
        if (resizeHandler.Direction == "horizontal" || resizeHandler.Direction == "both") {
            newState.Columns = this.state.Columns.map((k, colIndex) => {
                let width = k.width;
                if (colIndex == resizeHandler.ColumnIndex) {
                    width = Math.max(50, resizeHandler.Width + xPos - resizeHandler.XPos);
                }
                return {
                    ...k,
                    width: width
                };
            });
        }
        if (resizeHandler.Direction == "vertical" || resizeHandler.Direction == "both") {
            const newHeight = Math.max(24, resizeHandler.Height + yPos - resizeHandler.YPos)
            newState.CustomRowHeight = {
                ...this.state.CustomRowHeight,
                [resizeHandler.RowIndex]: newHeight
            };
        }
        this.setState(() => {
            return newState;
        });
    }

    render() {
        const { data, RowHeight } = this.props;
        const { Columns, CustomRowHeight } = this.state;
        return <table className="table table-sm table-striped table-bordered">
            <thead>
                <tr
                    style={{
                        display: "block",
                    }}>
                    {Columns.map((col, index) => {
                        return <th style={{
                            width: (col.width + 10) + "px"
                        }} key={"th_" + index}>
                            {col.Header()}
                        </th>
                    })}
                </tr>
            </thead>
            <tbody>
                {(data || []).map((row, rowIndex) => {
                    let rowBody = Columns.map((col, colIndex) => {
                        const heightOfRow = (CustomRowHeight[rowIndex] || RowHeight);
                        return <td
                            style={{
                            }}
                            key={"td_" + rowIndex + "_" + colIndex}>
                            <div style={{
                                backgroundColor: "yellow",
                                display: "block",
                                height: heightOfRow + "px",
                                width: col.width + "px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                margin: "0"
                            }}>
                                <div style={{
                                    verticalAlign: 'top',
                                    display: "inline-block",
                                    width: (col.width - 8) + "px"
                                }}>
                                    {col.Body(row)}
                                </div>
                                <DraggableCore
                                    onStart={this.resizeStart}
                                    onDrag={this.resizeDrag}
                                    onStop={this.resizeStop}
                                >
                                    <div style={{
                                        verticalAlign: 'top',
                                        backgroundColor: "black",
                                        display: "inline-block",
                                        cursor: "ew-resize",
                                        width: (8) + "px",
                                        minHeight: (heightOfRow) + "px",
                                    }} data-row={rowIndex} data-col={colIndex} data-direction="horizontal">
                                    </div>
                                </DraggableCore>
                            </div>
                            <div style={{
                                display: "block",
                                height: "8px",
                                width: col.width + "px",
                                margin: "0"
                            }}>
                                <DraggableCore
                                    onStart={this.resizeStart}
                                    onDrag={this.resizeDrag}
                                    onStop={this.resizeStop}
                                >
                                    <div style={{
                                        backgroundColor: "black",
                                        verticalAlign: 'top',
                                        cursor: "ns-resize",
                                        display: "inline-block",
                                        width: (col.width - 8) + "px",
                                        minHeight: "8px",
                                    }} data-row={rowIndex} data-col={colIndex} data-direction="vertical"></div>
                                </DraggableCore>
                                <DraggableCore
                                    onStart={this.resizeStart}
                                    onDrag={this.resizeDrag}
                                    onStop={this.resizeStop}
                                >
                                    <div style={{
                                        backgroundColor: "blue",
                                        verticalAlign: 'top',
                                        cursor: "nwse-resize",
                                        display: "inline-block",
                                        width: (8) + "px",
                                        minHeight: "8px",
                                    }} data-row={rowIndex} data-col={colIndex} data-direction="both"></div>
                                </DraggableCore>
                            </div>

                            {/* <div style={{
                                width: col.width,
                                display: "flex",
                                height: heightOfRow + "px",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                <div style={{
                                    flexGrow: 2,
                                    wordWrap: "break-word",
                                    wordBreak: "break-word"
                                }}>
                                    {col.Body(row)}
                                </div>
                                <DraggableCore
                                    onStart={this.resizeColumnStart}
                                    onDrag={this.resizeColumnDrag}
                                    onStop={this.resizeColumnStop}
                                >
                                    <div style={{
                                        flex: "0 0 8px",
                                        height: heightOfRow + "px",
                                        backgroundColor: "yellow",
                                        cursor: "ew-resize"
                                    }} data-row={rowIndex} data-col={colIndex}>
                                    </div>
                                </DraggableCore>
                            </div>
                            <DraggableCore
                                onStart={this.resizeRowStart}
                                onDrag={this.resizeRowDrag}
                                onStop={this.resizeRowStop}
                            >
                                <div style={{
                                    height: "8px",
                                    backgroundColor: "yellow",
                                    cursor: "ns-resize"
                                }} data-row={rowIndex} data-col={colIndex}></div>
                            </DraggableCore> */}
                        </td>;
                    });
                    return <tr
                        style={{
                            display: "block",
                        }}
                        key={"tr_" + rowIndex}>
                        {rowBody}
                    </tr>;
                })}
            </tbody>
        </table>;
    }
};
export default Table;