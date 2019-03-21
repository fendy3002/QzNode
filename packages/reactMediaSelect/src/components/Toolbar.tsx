let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
let lo = require('lodash');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.handleNewFolder = this.handleNewFolder.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }
    handleNewFolder(){
        const store = this.props.store;
        store.toggleNewFolder();
    }
    handleUpload(){
        const store = this.props.store;
        store.toggleUpload();
    }
    render() {
        let store = this.props.store;
        return <div className="col-12">
            <button className="btn btn-secondary" type="button" onClick={this.handleUpload}>
                <i className="fa fa-upload"></i> Upload
            </button>&nbsp;
            <button className="btn btn-secondary" type="button" onClick={this.handleNewFolder}>
                <i className="fa fa-folder"></i> New Folder
            </button>
        </div>;
    }
};