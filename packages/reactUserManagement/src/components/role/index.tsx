let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

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
        //const {user} = store.roleStore;
        return <>
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
            <div className="card">
                <div className="card-block">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-sm-12 text-right">
                                <a href="javascript:void(0)" onClick={this.redirectToRoot} className="btn btn-secondary">Cancel</a>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>;
    }
};