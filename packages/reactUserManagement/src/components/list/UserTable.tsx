let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let EditableLabel = require('@fendy3002/react-components').EditableLabel;

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserTable extends React.Component<any, any> {
    constructor(props) {
        super(props);
        
        this.handleAction = this.handleAction.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
    }
    handleAction(evt){
        evt.preventDefault();
        if(confirm("Are you sure to continue?") == true){
            let action = document.createElement("input");
            action.setAttribute("name", "action");
            action.setAttribute("type", "hidden");
            action.value = evt.target.value;
            
            evt.target.form.appendChild(action);
            evt.target.form.submit();
        }
        else{

        }
    }
    handleChangeEmail(evt){
        const target = evt.currentTarget;
        let store = this.props.store;
        store.changeEmail(target.dataset.id, evt.value).then(() => {
            window.location.reload();
        });
    }
    render() {
        let store = this.props.store;
        let {users} = store.listStore;
        if(!users){
            return null;
        }
        let userDoms = users.map((user, index) => {
            let availableActions = (user) => {
                let actions = [];
                if(user.currentUser){
                    return [
                        <i className="fa fa-user" title="Current User" key="icon"></i>,
                        " ",
                        <a href={"./userAccessModule/" + user.id} className="btn btn-secondary"
                            key="access">
                                <i className="fa fa-key"></i> Access
                        </a>
                    ];
                }
                if(user.is_confirmed){
                    if(user.is_super_admin){
                        actions.push(<button className="btn btn-secondary" onClick={this.handleAction}
                            type="submit" name="action" value="grant" key="grant">
                            Revoke admin
                        </button>);
                    }
                    else{
                        actions.push(<button className="btn btn-primary" onClick={this.handleAction}
                            type="submit" name="action" value="grant" key="grant">
                            Grant admin
                        </button>);
                    }
                    actions.push(" ");

                    if(user.is_active){
                        actions.push(
                            <button className="btn btn-secondary" onClick={this.handleAction}
                                type="submit" name="action" value="activate" key="activate">
                                Make Inactive
                            </button>
                        );
                    }
                    else{
                        actions.push(
                            <button className="btn btn-primary" onClick={this.handleAction}
                                type="submit" name="action" value="activate" key="activate">
                                Set Active
                            </button>);
                    }
                    actions.push(" ");

                    actions.push(
                        <button className="btn btn-primary" onClick={this.handleAction}
                            type="submit" name="action" value="reset" key="reset">
                            Reset Password
                        </button>
                    );
                    actions.push(
                        <a href={"./userAccessModule/" + user.id} className="btn btn-secondary"
                            key="access">
                            <i className="fa fa-key"></i> Access
                        </a>
                    );
                }
                else{
                    actions.push(
                        <button className="btn btn-primary" onClick={this.handleAction}
                            type="submit" name="action" value="confirmation" key="confirmation">
                            <i className="fa fa-send"></i> Resend confirmation
                        </button>
                    );
                }
                return actions;
            };
            return <tr key={index}>
                <td>
                    {user.username}
                </td>
                <td>
                    {user.name}
                </td>
                <td>
                    <EditableLabel value={user.email} inputClassName="form-control underlined"
                        data-id={user.id}
                        onChange={this.handleChangeEmail}>
                        <a href="javascript:void(0)">
                            <EditableLabel.Value /> <i className="fa fa-pencil"></i>
                        </a>
                    </EditableLabel>
                </td>
                <td>
                    {user.is_active ? "Yes" : "No"}
                </td>
                <td>
                    {user.is_super_admin ? "Yes" : "No"}
                </td>
                <td>
                    <form method="post">
                        {availableActions(user)}
                        <input type="hidden" name="id" value={user.id}/>
                    </form>
                </td>
            </tr>
        });
        return <section className="section">
            <div className="card">
                <div className="card-header bordered">
                    <div className="header-block">
                        <a href="/userManagement/register" className="btn btn-primary">Add User</a>
                    </div>
                </div>
                <div className="card-block" style={{ padding: "0px" }}>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Active</th>
                                    <th>Super Admin</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDoms}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>;
    }
}