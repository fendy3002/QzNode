let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class UserCreate extends React.Component<any, any> {
    constructor(props) {
        super(props);
        

    }
    render() {
        let store = this.props.store;
        const {page, limit, userCount} = store.listStore;
        return <>
            <div className="title-block">
                <h3 className="title"> User Management </h3>
                <p className="title-description"> Register user </p>
            </div>
        </>;
    }
};