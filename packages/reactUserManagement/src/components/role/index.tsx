const React = require('react');
const mobx = require('mobx');
const lo = require('lodash');
const mobxReact = require('mobx-react');
const {SelectedRoles} = require('./SelectedRoles.tsx');
const {RoleSelector} = require('./RoleSelector.tsx');

const {toJS} = mobx;
const {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserRole extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.redirectToRoot = this.redirectToRoot.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        
    }
    redirectToRoot(evt){
        this.props.store.mode.store.user = null;
        this.props.store.mode.store.selectedRoles = [];
        this.props.store.setPage("/");
    }
    handleSubmit(evt){
        evt.preventDefault();
        this.props.store.mode.store.submit();
    }
    handleAdd(evt){
        const store = this.props.store;
        const roleId = evt.currentTarget.dataset.id;
        const selectedRole = lo.find(store.mode.store.roles, (r) => r.id == roleId);
        if(selectedRole){
            store.mode.store.addRole(selectedRole);
        }
    }
    handleRemove(evt){
        const store = this.props.store;
        const roleId = evt.currentTarget.dataset.id;
        store.mode.store.removeRoleById(roleId);
    }
    render() {
        let store = this.props.store;
        const {user, roles, selectedRoles} = store.mode.store;
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

            <div className="card">
                <div className="card-header">
                    <div className="header-block">
                        <h2 className="title">User</h2>
                    </div>
                </div>
                <div className="card-block">
                    <div className="row form-group">
                        <label className="col-sm-4">Username</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control underlined" 
                                value={ user.username }
                                readOnly={true} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-sm-4">Name</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control underlined" 
                                value={ user.name }
                                readOnly={true} />
                        </div>
                    </div>
                </div>
            </div>
            <form onSubmit={this.handleSubmit}>
                <div className="card">
                    <div className="card-header">
                        <div className="header-block">
                            <h2 className="title">Selected Roles</h2>
                        </div>
                    </div>
                    <div className="card-block">
                        <SelectedRoles user={user} selectedRoles={selectedRoles} onClick={this.handleRemove}/>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="header-block">
                            <h2 className="title">Add Roles</h2>
                        </div>
                    </div>
                </div>
                <RoleSelector user={user} selectedRoles={selectedRoles} roles={roles} 
                    onClick={this.handleAdd}/>
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