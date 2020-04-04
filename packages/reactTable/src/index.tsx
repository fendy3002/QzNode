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
import * as types from './types';

class Table extends React.Component<types.Table.Props, types.Table.State> {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            customRowHeight: {},
            resizing: {
                columnIndex: null,
                rowIndex: null,
                width: null,
                height: null,
                xPos: null,
                yPos: null,
                direction: null,
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
        rowHeight: 24
    };

    static getDerivedStateFromProps(props, state) {
        let returnState = {
            ...state
        };
        if (state.columns.length != props.columns.length) {
            returnState.columns = props.columns.map(k => {
                return {
                    ...k,
                    width: k.startWidth || 120
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
                resizing: {
                    columnIndex: colIndex,
                    rowIndex: rowIndex,
                    width: state.columns[colIndex].width,
                    height: (this.state.customRowHeight[rowIndex] || this.props.rowHeight),
                    xPos: xPos,
                    yPos: yPos,
                    direction: direction,
                }
            };
        });
    }
    resizeDrag(evt) {
    }
    resizeStop(evt) {
        let resizeHandler = this.state.resizing;
        const xPos = evt.clientX;
        const yPos = evt.clientY;

        let newState: any = {
            resizing: {
                columnIndex: null,
                rowIndex: null,
                width: null,
                height: null,
                xPos: null,
                yPos: null,
                direction: null,
            }
        };
        if (resizeHandler.direction == "horizontal" || resizeHandler.direction == "both") {
            newState.columns = this.state.columns.map((k, colIndex) => {
                let width = k.width;
                if (colIndex == resizeHandler.columnIndex) {
                    width = Math.max(50, resizeHandler.width + xPos - resizeHandler.xPos);
                }
                return {
                    ...k,
                    width: width
                };
            });
        }
        if (resizeHandler.direction == "vertical" || resizeHandler.direction == "both") {
            const newHeight = Math.max(24, resizeHandler.height + yPos - resizeHandler.yPos)
            newState.customRowHeight = {
                ...this.state.customRowHeight,
                [resizeHandler.rowIndex]: newHeight
            };
        }
        this.setState(() => {
            return newState;
        });
    }

    headerClick(evt) {

    }

    render() {
        const { data, headerHeight, rowHeight } = this.props;
        const { columns, customRowHeight } = this.state;
        return <div>
            <div>
                <BsTable>
                    <BsTHead>
                        <BsTr>
                            {columns.map((col, colIndex) => {
                                const heightOfRow = (customRowHeight["thead"] || headerHeight);
                                return <BsTh
                                    style={{
                                        paddingRight: "0px",
                                        paddingBottom: "0px"
                                    }}
                                    csswidth={col.width + 10} key={"th_" + colIndex}>
                                    <ResizableDiv
                                        body={col.header()}
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
                            let rowBody = columns.map((col, colIndex) => {
                                const heightOfRow = (customRowHeight[rowIndex] || rowHeight);
                                return <BsTd
                                    style={{
                                        paddingRight: "0px",
                                        paddingBottom: "0px"
                                    }}
                                    key={"td_" + rowIndex + "_" + colIndex}>
                                    <ResizableDiv
                                        body={col.body(row)}
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