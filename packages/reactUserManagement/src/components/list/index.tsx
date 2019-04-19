let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {UserTable} = require('./UserTable.tsx');
let {Pagination} = require('@fendy3002/react-components');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserList extends React.Component<any, any> {
    handlePage(evt){

    }
    render() {
        let store = this.props.store;
        const {page, limit, userCount} = store.listStore;

        return <>
            <div className="title-block">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> Manage users </p>
            </div>
            <UserTable/>
            <div className="text-right">
                <Pagination count={userCount} page={page} limit={limit} onClick={this.handlePage} />
            </div>
        </>;
    }
};