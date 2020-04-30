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
    DivNinjaPanel,
    BsButtonSecondary
} = require('./styled');
const hash = require('object-hash');
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import ResizableDiv from './ResizableDiv';
import * as types from './types';

class ListTable extends React.Component<types.Table.Props, types.ListTable.State> {
    constructor(props) {
        super(props);
        this.state = {
            customColumnWidth: {},
            customRowHeight: {},
            extendedRow: {},
            hashData: null,
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
            "handleExtend"
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

    resizeStart(evt) {
        const colIndex = evt.currentTarget.dataset.col;
        const rowIndex = evt.currentTarget.dataset.row;
        const direction = evt.currentTarget.dataset.direction;
        const xPos = evt.clientX;
        const yPos = evt.clientY;
        const { columns } = this.props;
        let height = (
            this.state.customRowHeight[rowIndex] ||
            ((rowIndex == "thead") ? this.props.headerHeight : this.props.rowHeight)
        );
        let width = (
            this.state.customColumnWidth[colIndex] ||
            columns[colIndex].startWidth
        );
        this.setState((state) => {
            return {
                resizing: {
                    columnIndex: colIndex,
                    rowIndex: rowIndex,
                    width: width,
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
            const newWidth = Math.max(50, resizeHandler.width + xPos - resizeHandler.xPos);
            newState.customColumnWidth = {
                ...this.state.customColumnWidth,
                [resizeHandler.columnIndex]: newWidth
            };
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
        const { columns, sort, onChange } = this.props;
        const colClickIndex = evt.currentTarget.dataset.col;
        const sortField = columns[colClickIndex].sort();
        let newOrder = 1;
        if (sort[0] && (sort[0] == sortField + ",1" || sort[0] == sortField + ",asc")) {
            newOrder = -1;
        }
        let args = {
            sort: {
                0: sortField + "," + newOrder.toString()
            }
        };
        onChange(args);
    }
    domHandleScroll(evt) {
        this.ref.headerDiv.current.scrollLeft = evt.target.scrollLeft;
    }
    trNinjaOnEnter(evt) {
        const ninjapanel = evt.currentTarget.querySelector("[data-role='ninjapanel']");
        if (!ninjapanel) {
            return;
        }
        ninjapanel.style.display = "block";
        const ninjapanelWidth = ninjapanel.offsetWidth;
        const scrollContainer = evt.currentTarget.closest("[data-role='scroll-container']");
        const tableDom = evt.currentTarget.closest("table");
        const expectedLeft = Math.min(scrollContainer.offsetWidth, tableDom.offsetWidth) - 72 - ninjapanelWidth + scrollContainer.scrollLeft;
        ninjapanel.style.left = expectedLeft + "px";
        ninjapanel.style.top = ninjapanel.parentElement.offsetTop + 12 + "px";
    }
    trNinjaOnLeave(evt) {
        const ninjapanel = evt.currentTarget.querySelector("[data-role='ninjapanel']");
        if (!ninjapanel) {
            return;
        }
        ninjapanel.style.display = "none";
    }
    handleExtend(evt) {
        const { onExtend } = this.props;
        const rowIndex = evt.currentTarget.dataset.row;
        let doExtend = Promise.resolve();
        if (onExtend) {
            let args = {
                data: this.props.data[rowIndex],
                direction: this.state.extendedRow[rowIndex] ? "expand" : "shrink",
            };
            doExtend = onExtend(args);
        }
        doExtend.then(() => {
            this.setState((state) => {
                return {
                    extendedRow: {
                        ...state.extendedRow,
                        [rowIndex]: !state.extendedRow[rowIndex]
                    }
                };
            });
        });
    }

    static getDerivedStateFromProps(props, state) {
        let hashData = hash(props.data);
        let returnState: any = {
            hashData: hashData
        };
        if (hashData != state.hashData) {
            returnState = {
                ...returnState,
                customRowHeight: {},
                extendedRow: {},
            }
        }

        return returnState;
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
        const { data, columns,
            headerHeight, rowHeight, bodyHeight,
            extensible, toolbar, sort } = this.props;
        const { customColumnWidth, customRowHeight, extendedRow } = this.state;
        let sortFields: any = {};
        for (let sortIndex of Object.keys(sort || {})) {
            let sortVal = sort[sortIndex].split(",");
            sortFields[sortVal[0]] = sortVal[1];
        }
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
                                {extensible &&
                                    <BsTh key="th_extbutton" style={{ width: "25px" }}>
                                    </BsTh>
                                }
                                {columns.map((col, colIndex) => {
                                    const heightOfRow = (customRowHeight["thead"] || headerHeight || 24);
                                    let useColWidth = customColumnWidth[colIndex] || col.startWidth || 120;
                                    let sortField = col.sort ? col.sort() : null;
                                    let colBodyWidth = !sortField ? useColWidth : (useColWidth - 24);
                                    let body = !sortField ? col.header() : <>
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
                                                sortFields[sortField] == 1 ? faSortUp :
                                                    sortFields[sortField] == -1 ? faSortDown :
                                                        faSort)} />
                                        </div>
                                    </>;
                                    let addProps: any = {}
                                    if (col.sort) {
                                        addProps.onClick = this.headerClick;
                                    }

                                    return <BsTh
                                        style={{
                                            paddingRight: "0px",
                                            paddingBottom: "0px"
                                        }}
                                        csswidth={useColWidth + 10} key={"th_" + colIndex}>
                                        <ResizableDiv
                                            body={body}
                                            data={{
                                                "data-row": "thead",
                                                "data-col": colIndex
                                            }}
                                            {...addProps}
                                            width={useColWidth}
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
                                const heightOfRow = (customRowHeight[rowIndex] || rowHeight);
                                const isExtended = extendedRow[rowIndex];
                                let extendPanel = null;
                                if (extensible) {
                                    extendPanel = <div style={{ display: "block", height: heightOfRow + "px" }}>
                                        <BsButtonSecondary
                                            onClick={this.handleExtend}
                                            btntype={isExtended ? "" : "success"}
                                            data-row={rowIndex} style={{ height: "100%", width: "24px", padding: "0px" }}>
                                            <FAIcon icon={isExtended ? faCaretUp : faCaretDown}></FAIcon>
                                        </BsButtonSecondary>
                                    </div>;
                                }
                                let totalWidth = 0;
                                let rowBody = columns.map((col, colIndex) => {
                                    let useColWidth = customColumnWidth[colIndex] || col.startWidth || 120;
                                    totalWidth += useColWidth;

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
                                            width={useColWidth}
                                            height={heightOfRow}
                                            onResizeStart={this.resizeStart}
                                            onResizeDrag={this.resizeDrag}
                                            onResizeStop={this.resizeStop}
                                        ></ResizableDiv>
                                    </BsTd>;
                                });
                                let extendedDom = null;
                                if (isExtended) {
                                    let extendedContent = extensible({ data: row });
                                    if (extendedContent) {
                                        extendedDom = <BsTr key={"tr_" + rowIndex + "_ext"}>
                                            <BsTd colspan="99" style={{ maxWidth: totalWidth + "px", padding: "0px" }}>
                                                {extensible({ data: row })}
                                            </BsTd>
                                        </BsTr>;
                                    }
                                }
                                return <React.Fragment key={"trx_" + rowIndex}>
                                    <TrNinjaContainer
                                        onMouseEnter={this.trNinjaOnEnter}
                                        onMouseLeave={this.trNinjaOnLeave}
                                        key={"tr_" + rowIndex}>
                                        <BsTd
                                            key={"td_" + rowIndex + "_extbutton"}
                                            style={{ padding: "0px" }}>{extendPanel}</BsTd>
                                        {rowBody}
                                        <BsTd key={"td_" + rowIndex + "_act"}>
                                            {toolbar && <DivNinjaPanel data-role="ninjapanel" extend="left">
                                                {toolbar(row)}
                                            </DivNinjaPanel>
                                            }
                                        </BsTd>
                                    </TrNinjaContainer>
                                    {extendedDom}
                                </React.Fragment>;
                            })}
                        </BsTBody>
                    </BsTable>
                </div>
            </div>
        </>;
    }
};
export default ListTable;