const React = require('react');
const lo = require('lodash');
const {
    BsTHead,
    BsTBody,
    BsTh,
    BsTr,
    BsTd,
    BsTable,
    TrNinjaContainer,
    DivNinjaPanel
} = require('./styled');
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

import ResizableDiv from './ResizableDiv';
import * as types from './types';

class ListTable extends React.Component<types.Table.Props, types.ListTable.State> {
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
            "domHandleScroll",
            "trNinjaOnEnter",
            "trNinjaOnLeave"
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.ref = {
            ...this.ref,
            headerDiv: React.createRef(),
            bodyDiv: React.createRef(),
        };
    }
    public static defaultProps = {
        rowHeight: 24,
        bodyHeight: 300
    };
    ref = {
        headerDiv: null,
        bodyDiv: null
    };

    static getDerivedStateFromProps(props, state) {
        let returnState = {
            ...state
        };
        if (state.columns.length != props.columns.length) {
            returnState.columns = props.columns.map(k => {
                return {
                    ...k,
                    width: k.startWidth || 120,
                    sortable: k.sortable || true
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
        let height = (
            this.state.customRowHeight[rowIndex] ||
                rowIndex == "thead" ? this.props.headerHeight : this.props.rowHeight
        );

        this.setState((state) => {
            return {
                resizing: {
                    columnIndex: colIndex,
                    rowIndex: rowIndex,
                    width: state.columns[colIndex].width,
                    height: height,
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
        const colClickIndex = evt.currentTarget.dataset.col;
        this.setState((state) => {
            return {
                columns: state.columns.map((col, colIndex) => {
                    let sort = null;
                    if (colIndex == colClickIndex) {
                        sort = col.sort * -1 || 1;
                    }
                    return {
                        ...col,
                        sort: sort
                    };
                })
            }
        })
    }
    domHandleScroll(evt) {
        this.ref.headerDiv.current.scrollLeft = evt.target.scrollLeft;
    }
    trNinjaOnEnter(evt) {
        const ninjapanel = evt.currentTarget.querySelector("[data-role='ninjapanel']");
        ninjapanel.style.display = "block";
        const ninjapanelWidth = ninjapanel.offsetWidth;
        const scrollContainer = evt.currentTarget.closest("[data-role='scroll-container']");
        const expectedLeft = scrollContainer.offsetWidth - 72 - ninjapanelWidth + scrollContainer.scrollLeft;
        ninjapanel.style.left = expectedLeft + "px";
        ninjapanel.style.top = ninjapanel.parentElement.offsetTop + 12 + "px";
    }
    trNinjaOnLeave(evt) {
        const ninjapanel = evt.currentTarget.querySelector("[data-role='ninjapanel']");
        ninjapanel.style.display = "none";
    }

    componentDidMount() {
        if (this.ref.bodyDiv && this.ref.bodyDiv.current) {
            this.ref.bodyDiv.current.addEventListener("scroll", this.domHandleScroll);
        }
    }
    componentWillUnmount() {
        if (this.ref.bodyDiv && this.ref.bodyDiv.current) {
            this.ref.bodyDiv.current.removeEventListener("scroll", this.domHandleScroll);
        }
    }

    render() {
        const { data, headerHeight, rowHeight, bodyHeight, toolbar } = this.props;
        const { columns, customRowHeight } = this.state;
        return <>
            <div style={{ overflow: "hidden" }} ref={this.ref.headerDiv}>
                <div style={{
                    display: "inline-block",
                    marginRight: "64px",
                    marginBottom: "0px",
                    paddingBottom: "0px",
                    verticalAlign: "top",
                }}>
                    <BsTable>
                        <BsTHead>
                            <BsTr>
                                {columns.map((col, colIndex) => {
                                    const heightOfRow = (customRowHeight["thead"] || headerHeight);
                                    let colBodyWidth = !col.sortable ? col.width : col.width - 24;
                                    let body = !col.sortable ? col.header() : <>
                                        <div style={{
                                            display: "inline-block",
                                            width: colBodyWidth + "px"
                                        }}>
                                            {col.header()}
                                        </div>
                                        <div style={{
                                            display: "inline-block"
                                        }}>
                                            <FAIcon icon={(
                                                col.sort == 1 ? faSortUp :
                                                    col.sort == -1 ? faSortDown :
                                                        faSort)} />
                                        </div>
                                    </>;

                                    return <BsTh
                                        style={{
                                            paddingRight: "0px",
                                            paddingBottom: "0px"
                                        }}
                                        csswidth={col.width + 10} key={"th_" + colIndex}>
                                        <ResizableDiv
                                            body={body}
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
            </div>
            <div style={{
                height: bodyHeight + "px",
                overflowY: "scroll",
                overflowX: "scroll",
            }} ref={this.ref.bodyDiv} data-role={"scroll-container"}>
                <div style={{
                    display: "inline-block",
                    marginRight: "32px",
                    marginBottom: "32px",
                    verticalAlign: "top",
                    position: "relative"
                }}>
                    <BsTable>
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
                                return <TrNinjaContainer
                                    onMouseEnter={this.trNinjaOnEnter}
                                    onMouseLeave={this.trNinjaOnLeave}
                                    key={"tr_" + rowIndex}>
                                    {rowBody}
                                    <BsTd key={"td_" + rowIndex + "_act"}>
                                        <DivNinjaPanel data-role="ninjapanel" extend="left">
                                            {toolbar(row)}
                                        </DivNinjaPanel>
                                    </BsTd>
                                </TrNinjaContainer>;
                            })}
                        </BsTBody>
                    </BsTable>
                </div>
            </div>
        </>;
    }
};
export default ListTable;