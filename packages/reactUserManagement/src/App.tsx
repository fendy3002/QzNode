let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {UserList} = require('./components/list/index.tsx');
let {UserCreate} = require('./components/create/index.tsx');
let {UserRole} = require('./components/role/index.tsx');

let {observer, inject} = mobxReact;

import 'toastr/build/toastr.css';

@inject("store")
@observer
export class App extends React.Component<any, any> {
    componentDidMount(){
        let store = this.props.store;
        store.initialize();
    }
    componentWillUnmount(){
        let store = this.props.store;
        store.uninitialize();
    }
    render() {
        let store = this.props.store;
        let renderDom = [];
        
        if(store.page == "list"){
            renderDom.push(<UserList key="list"/>)
        }
        if(store.page == "create"){
            renderDom.push(<UserCreate key="create"/>)
        }
        if(store.page == "role"){
            renderDom.push(<UserRole key="role"/>)
        }
        if(store.isLoading){
            renderDom = [
                <div className="loading" key="loading">
                    <div className="spinner">
                    </div>
                </div>
            ].concat(renderDom);
        }

        return renderDom;
    }
};