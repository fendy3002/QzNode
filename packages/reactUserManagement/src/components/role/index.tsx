let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
let {SelectedRoles} = require('./SelectedRoles.tsx');
let {RoleSelector} = require('./RoleSelector.tsx');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserRole extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.redirectToRoot = this.redirectToRoot.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    redirectToRoot(evt){
        this.props.store.setPage("/");
    }
    handleSubmit(evt){
        evt.preventDefault();
        this.props.store.roleStore.submit();
    }
    handleInputChange(evt){
        this.props.store.roleStore.changeUser({
            [evt.target.name]: evt.target.value
        });
    }
    render() {
        let store = this.props.store;
        const {user, roles} = store.roleStore;

        const pageHeader = <>
            <div className="title-block">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> User role </p>
            </div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="javascript:void(0)" onClick={this.redirectToRoot}>User Management</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Role</li>
                </ol>
            </nav>
        </>;
        if(!user){
            return pageHeader;
        }
        return <>
            {pageHeader}
            <form onSubmit={this.handleSubmit}>
                <div className="card">
                    <div className="card-block">
                        <SelectedRoles user={user}/>
                    </div>
                </div>
                <RoleSelector user={user} roles={roles}/>
                <div className="card">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-sm-12 text-right">
                                <a href="javascript:void(0)" onClick={this.redirectToRoot} className="btn btn-secondary">Cancel</a>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>;
    }
};