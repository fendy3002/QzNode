const React = require('react');
const lo = require('lodash');
const {
    BsTHead,
    BsTBody,
    BsTh,
    BsTr,
    BsTd,
    BsTable,
    BsButtonSecondary,
    DivRow,
    DivCol6,
    TrNinjaContainer,
    DivNinjaPanel
} = require('./styled');
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

import ResizableDiv from './ResizableDiv';
import * as types from './types';
import Pagination from './Pagination';

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
        rowHeight: 24
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
        const { data, headerHeight, rowHeight, pagination, toolbar } = this.props;
        const { columns, customRowHeight } = this.state;
        return <div>
            <div style={{ marginBottom: "8px" }}>
                <DivRow>
                    <DivCol6>
                    </DivCol6>
                    <DivCol6 style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-block", marginRight: "8px" }}>
                            <BsButtonSecondary type="button">
                                <FAIcon icon={faFilter}></FAIcon>
                            </BsButtonSecondary>
                        </div>
                        <Pagination {...pagination}></Pagination>
                    </DivCol6>
                </DivRow>
            </div>
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
            </div>
            <div style={{
                height: "300px",
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
            <div style={{ marginBottom: "8px" }}>
                {/* <div className="row">
                    <div className="col-6">
                    </div >
                    <div className="col-6 text-right">
                        <Pagination page={12} pageCount={25}></Pagination>
                    </div>
                </div > */}
            </div>
        </div>;
    }
};
export default Table;