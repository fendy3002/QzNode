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
import ListTable from './ListTable';

class Table extends React.Component<types.Table.Props, any> {
    constructor(props) {
        super(props);
        this.state = {
        };
        [

        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    public static defaultProps = {
        rowHeight: 24
    };

    render() {
        const { pagination } = this.props;
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
            <ListTable {...this.props}/>
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