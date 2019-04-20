let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserCreate extends React.Component<any, any> {
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
        this.props.store.createStore.submit();
    }
    handleInputChange(evt){
        this.props.store.createStore.changeUser({
            [evt.target.name]: evt.target.value
        });
    }
    render() {
        let store = this.props.store;
        const {user} = store.createStore;
        return <>
            <div className="title-block">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> Register user </p>
            </div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="javascript:void(0)" onClick={this.redirectToRoot}>User Management</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Create</li>
                </ol>
            </nav>
            <div className="card">
                <div className="card-block">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row form-group">
                                    <label className="col-sm-4">Username</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control underlined" 
                                            name="username" value={ user.username }
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row form-group">
                                    <label className="col-sm-4">Name</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control underlined" 
                                            name="name" value={ user.name }
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row form-group">
                                    <label className="col-sm-4">Email</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control underlined" 
                                            name="email" value={ user.email }
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
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