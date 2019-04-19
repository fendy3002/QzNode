let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {UserTable} = require('./UserTable.tsx');
let {Pagination} = require('./Pagination.tsx');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserList extends React.Component<any, any> {
    render() {
        let store = this.props.store;

        return <>
            <div className="title-block">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> Manage users </p>
            </div>
            <UserTable/>
            <Pagination/>
        </>;
    }
};