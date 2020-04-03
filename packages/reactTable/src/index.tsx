const React = require('react');
const lo = require('lodash');
const { DraggableCore } = require('react-draggable');

interface State {
    Columns: TableColumn[]
    ResizingColumnIndex: number,
    StartColumnWidth: number,
    StartXPos: number
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
            ResizingColumnIndex: -1,
            StartColumnWidth: 0,
            StartXPos: 0,
        };
        [
            "resizeColumnDrag",
            "resizeColumnStart",
            "resizeColumnStop"
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
        const xPos = evt.clientX;
        this.setState(() => {
            return {
                ResizingColumnIndex: resizingColIndex,
                StartXPos: xPos,
            };
        });
    }
    resizeColumnDrag(evt) {
    }
    resizeColumnStop(evt) {
        const resizingColIndex = this.state.ResizingColumnIndex;
        const xPos = evt.clientX;
        const startXPos = this.state.StartXPos;
        const newColumns = this.state.Columns.map((k, colIndex) => {
            let width = k.width;
            if (colIndex == resizingColIndex) {
                width = k.width + xPos - startXPos;
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

    render() {
        const { data, RowHeight } = this.props;
        const { Columns } = this.state;
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
                        return <td
                            style={{
                            }}
                            key={"td_" + rowIndex + "_" + colIndex}>
                            <div style={{
                                width: col.width,
                                display: "flex",
                                height: RowHeight + "px",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                <div style={{
                                    flexGrow: 2
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
                                        height: RowHeight + "px",
                                        backgroundColor: "yellow",
                                        cursor: "ew-resize"
                                    }} data-row={rowIndex} data-col={colIndex}>
                                    </div>
                                </DraggableCore>
                            </div>
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