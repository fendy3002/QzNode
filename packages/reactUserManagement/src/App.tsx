let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');

let {UserList} = require('./components/list/index.tsx');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class App extends React.Component<any, any> {
    componentDidMount(){
        let store = this.props.store;
        store.initialize();
    }
    render() {
        let store = this.props.store;
        let renderDom = [];
        
        if(store.page == "list"){
            renderDom.push(<UserList key="list"/>)
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