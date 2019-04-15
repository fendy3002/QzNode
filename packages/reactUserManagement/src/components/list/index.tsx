let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let UserTable = require('./UserTable.js');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserList extends React.Component<any, any> {
    componentDidMount(){
        let store = this.props.store;
        store.loadUsers();
    }
    render() {
        let store = this.props.store;

        return <>
            <div className="title-block" key="header">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> Manage users </p>
            </div>
            <UserTable key="table"/>
        </>;
    }
};