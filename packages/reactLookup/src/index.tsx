const React = require('react');
const lo = require('lodash');
const {
    BsCard,
    BsCardHeader,
    BsCardBody,
    BsCardFooter,
    BsButtonSecondary,
    DivRow,
    DivCol6,
} = require('./styled');
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

import ResizableDiv from './ResizableDiv';
import * as types from './types';
import Pagination from './Pagination';
import ListTable from './ListTable';

class Table extends React.Component<types.Table.Props, types.Table.State> {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: false
        };
        [
            "handleSortChange",
            "handlePageChange",
            "handleToggleShowFilter"
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    public static defaultProps = {
        rowHeight: 24,
        bodyHeight: 300
    };

    handleSortChange(args) {
        const { onChange, pagination } = this.props;
        onChange({
            ...args,
            page: 1,
            limit: pagination.limit,
        });
    }
    handlePageChange(evt) {
        const { onChange, pagination, sort } = this.props;
        let newPage = evt.value;
        onChange({
            sort: sort,
            page: newPage,
            limit: pagination.limit,
        });
    }
    handleFilterChange() {

    }
    handleToggleShowFilter(evt) {
        let { onFilterApply, onFilterCancel } = this.props;
        let role = evt.currentTarget.dataset.role;
        let showFilter = false;
        if (role == "show") {
            showFilter = true;
        }
        else if (role == "cancel") {
            if (onFilterCancel) {
                onFilterCancel(evt);
            }
        }
        else if (role == "apply") {
            onFilterApply(evt);
        }

        this.setState(state => {
            return {
                showFilter: showFilter
            };
        });
    }

    render() {
        const { showFilter } = this.state;
        const { pagination, filterPage, bodyHeight } = this.props;
        if (showFilter) {
            return <BsCard>
                <BsCardHeader>
                    Filter
                </BsCardHeader>
                <BsCardBody
                    style={{ minHeight: bodyHeight + "px", overflowY: "auto", padding: "15px" }}>
                    {filterPage()}
                </BsCardBody>
                <BsCardFooter
                    style={{ textAlign: "right", paddingLeft: "15px", paddingRight: "15px" }}>
                    <BsButtonSecondary type="button" onClick={this.handleToggleShowFilter} data-role="cancel">
                        <FAIcon icon={faTimes}></FAIcon>&nbsp;Cancel
                    </BsButtonSecondary>&nbsp;
                    <BsButtonSecondary type="button" onClick={this.handleToggleShowFilter} data-role="apply" btntype="primary" >
                        <FAIcon icon={faSearch}></FAIcon>&nbsp;Apply
                    </BsButtonSecondary>
                </BsCardFooter>
            </BsCard>;
        }
        else {
            return <div>
                <div style={{ marginBottom: "8px" }}>
                    <DivRow>
                        <DivCol6>
                        </DivCol6>
                        <DivCol6 style={{ textAlign: "right" }}>
                            {filterPage &&
                                <div style={{ display: "inline-block", marginRight: "8px" }}>
                                    <BsButtonSecondary type="button" onClick={this.handleToggleShowFilter} data-role="show">
                                        <FAIcon icon={faFilter}></FAIcon>
                                    </BsButtonSecondary>
                                </div>
                            }
                            <Pagination {...pagination} onChange={this.handlePageChange}></Pagination>
                        </DivCol6>
                    </DivRow>
                </div>
                <ListTable {...this.props} onChange={this.handleSortChange} />
                <div style={{ marginBottom: "8px" }}>
                    <div className="row">
                        <div className="col-6">
                        </div >
                        <div className="col-6 text-right">
                            <Pagination {...pagination} onChange={this.handlePageChange}></Pagination>
                        </div>
                    </div >
                </div>
            </div>;
        }
    }
};
export default Table;
export { ListTable };