const React = require('react');
const lo = require('lodash');
const {
    BsTHead,
    BsTBody,
    BsTh,
    BsTr,
    BsTd,
    BsTable
} = require('./styled');
import ResizableDiv from './ResizableDiv';

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
};

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
            "headerClick",
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    public static defaultProps = {
        RowHeight: 24
    };

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

    headerClick(evt) {

    }

    render() {
        const { data, HeaderHeight, RowHeight } = this.props;
        const { Columns, CustomRowHeight } = this.state;
        return <div>
            <div>
                <BsTable>
                    <BsTHead>
                        <BsTr>
                            {Columns.map((col, colIndex) => {
                                const heightOfRow = (CustomRowHeight["thead"] || HeaderHeight);
                                return <BsTh
                                    style={{
                                        paddingRight: "0px",
                                        paddingBottom: "0px"
                                    }}
                                    csswidth={col.width + 10} key={"th_" + colIndex}>
                                    <ResizableDiv
                                        body={col.Header()}
                                        data={{
                                            "data-row": "thead",
                                            "data-col": colIndex
                                        }}
                                        onClick={this.headerClick}
                                        width={col.width}
                                        height={heightOfRow}
                                        onResizeStart={this.resizeStart}
                                        onResizeDrag={this.resizeDrag}
                                        onResizeStop={this.resizeStop}
                                    ></ResizableDiv>
                                </BsTh>
                            })}
                        </BsTr>
                    </BsTHead>
                </BsTable>
            </div>
            <div style={{
                height: "300px",
                overflowY: "scroll"
            }}>
                <BsTable className="table table-sm table-striped table-bordered">
                    <BsTBody>
                        {(data || []).map((row, rowIndex) => {
                            let rowBody = Columns.map((col, colIndex) => {
                                const heightOfRow = (CustomRowHeight[rowIndex] || RowHeight);
                                return <BsTd
                                    style={{
                                        paddingRight: "0px",
                                        paddingBottom: "0px"
                                    }}
                                    key={"td_" + rowIndex + "_" + colIndex}>
                                    <ResizableDiv
                                        body={col.Body(row)}
                                        data={{
                                            "data-row": rowIndex,
                                            "data-col": colIndex
                                        }}
                                        width={col.width}
                                        height={heightOfRow}
                                        onResizeStart={this.resizeStart}
                                        onResizeDrag={this.resizeDrag}
                                        onResizeStop={this.resizeStop}
                                    ></ResizableDiv>
                                </BsTd>;
                            });
                            return <BsTr
                                key={"tr_" + rowIndex}>
                                {rowBody}
                            </BsTr>;
                        })}
                    </BsTBody>
                </BsTable>
            </div>
        </div>;
    }
};
export default Table;