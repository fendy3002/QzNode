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
    }
    redirectToRoot(evt){
        this.props.store.setPage("/");
    }
    render() {
        let store = this.props.store;
        const {page, limit, userCount} = store.listStore;
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
        </>;
    }
};