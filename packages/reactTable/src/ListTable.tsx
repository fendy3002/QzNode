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
            "trNinjaOnLeave",
            "handleChange"
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
                        sort = col.sortOrder * -1 || 1;
                    }
                    return {
                        ...col,
                        sortOrder: sort
                    };
                })
            }
        });
        this.handleChange();
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
    handleChange() {
        const { onChange } = this.props;
        let changeArgs: any = {};
        // assign parameters
        if (onChange) {
            onChange(changeArgs);
        }
    }

    getChangeArgs() {
        let sort: any = {};
        let sortIndex = 0;
        for (let col of this.state.columns) {
            if (col.sortOrder == 1 || col.sortOrder == -1) {
                sort[sortIndex] = col.sort();
                sortIndex++;
            }
        }
        let args: types.ListTable.ChangeArgs = {
            filter: {},
            limit: 0,
            page: 0,
            sort: {}
        };
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
                                    let colBodyWidth = !col.sort ? col.width : col.width - 24;
                                    let body = !col.sort ? col.header() : <>
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
                                                col.sortOrder == 1 ? faSortUp :
                                                    col.sortOrder == -1 ? faSortDown :
                                                        faSort)} />
                                        </div>
                                    </>;
                                    let addProps: any = {}
                                    if(col.sort){
                                        addProps.onClick= this.headerClick;
                                    }

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
                                            {...addProps}
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