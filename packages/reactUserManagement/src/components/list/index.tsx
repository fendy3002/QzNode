let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {UserTable} = require('./UserTable.tsx');
let {Pagination} = require('@fendy3002/react-components');
let {PageLimit} = require('@fendy3002/react-components');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserList extends React.Component<any, any> {
    constructor(props) {
        super(props);
        
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeLimit = this.handleChangeLimit.bind(this);
    }
    handleChangePage(evt){
        const store = this.props.store;
        const page = evt.value;
        const currentPage = store.mode.store.page();

        if(page != currentPage){
            store.mode.store.setPage(page).then(() => {
                this.forceUpdate((evt) => {});
            });
        }
    }
    handleChangeLimit(evt){
        const store = this.props.store;
        const limit = evt.value;
        const currentLimit = store.mode.store.page();

        if(limit != currentLimit){
            store.mode.store.setLimit(limit).then(() => {
                this.forceUpdate((evt) => {});
            });
        }
    }
    render() {
        let store = this.props.store;
        const {page, limit, userCount} = store.mode.store;
        return <>
            <div className="title-block">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> Manage users </p>
            </div>
            <UserTable/>
            <div className="text-right">
                <Pagination count={userCount} page={page()} limit={limit()} onChange={this.handleChangePage} />&nbsp;
                <span>Per page:</span>&nbsp;
                <PageLimit className="form-control inline" 
                    style={{ "display": "inline", "width": "auto" }}
                    value={limit()} options={[ 20, 50, 100 ]} onChange={this.handleChangeLimit} />
            </div>
        </>;
    }
};