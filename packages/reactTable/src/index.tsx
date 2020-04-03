const React = require('react');
const lo = require('lodash');
const { DraggableCore } = require('react-draggable');

interface State {
    Columns: TableColumn[]
    ResizingColumnIndex: number,
    StartColumnWidth: number,
    StartXPos: number,
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
            ResizingColumnIndex: -1,
            StartColumnWidth: 0,
            StartXPos: 0,
            ResizingRowIndex: -1,
            StartRowHeight: 0,
            StartYPos: 0,
        };
        [
            "resizeColumnDrag",
            "resizeColumnStart",
            "resizeColumnStop",
            "resizeRowDrag",
            "resizeRowStart",
            "resizeRowStop"
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
    resizeColumnStart(evt) {
        const resizingColIndex = evt.currentTarget.dataset.col;
        const startColumnWidth = this.state.Columns[resizingColIndex].width;
        const xPos = evt.clientX;
        this.setState(() => {
            return {
                ResizingColumnIndex: resizingColIndex,
                StartXPos: xPos,
                StartColumnWidth: startColumnWidth
            };
        });
    }
    resizeColumnDrag(evt) {

    }
    resizeColumnStop(evt) {
        const resizingColIndex = this.state.ResizingColumnIndex;
        const startColumnWidth = this.state.StartColumnWidth;
        const xPos = evt.clientX;
        const startXPos = this.state.StartXPos;
        const newColumns = this.state.Columns.map((k, colIndex) => {
            let width = k.width;
            if (colIndex == resizingColIndex) {
                width = Math.max(50, startColumnWidth + xPos - startXPos);
            }
            return {
                ...k,
                width: width
            };
        });
        this.setState(() => {
            return {
                Columns: newColumns,
                ResizingColumnIndex: -1,
                StartXPos: 0,
            };
        });
    }

    resizeRowStart(evt) {
        const resizingRowIndex = evt.currentTarget.dataset.row;
        const startRowHeight = (this.state.CustomRowHeight[resizingRowIndex] || this.props.RowHeight);
        const yPos = evt.clientY;
        this.setState(() => {
            return {
                ResizingRowIndex: resizingRowIndex,
                StartYPos: yPos,
                StartRowHeight: startRowHeight
            };
        });
    }
    resizeRowDrag(evt) {

    }
    resizeRowStop(evt) {
        const resizingRowIndex = this.state.ResizingRowIndex;
        const startRowHeight = this.state.StartRowHeight;
        const yPos = evt.clientY;
        const startYPos = this.state.StartYPos;
        const newHeight = Math.max(24, startRowHeight + yPos - startYPos)
        console.log(resizingRowIndex);
        
        this.setState(() => {
            return {
                CustomRowHeight: {
                    ...this.state.CustomRowHeight,
                    [resizingRowIndex]: newHeight
                },
                ResizingRowIndex: -1,
                StartYPos: 0,
            };
        });
    }

    render() {
        const { data, RowHeight } = this.props;
        const { Columns, CustomRowHeight } = this.state;
        return <table>
            <thead>
                <tr
                    style={{
                        display: "block",
                    }}>
                    {Columns.map((col, index) => {
                        return <th width={col.width} key={"th_" + index}>
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
                            </DraggableCore>
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