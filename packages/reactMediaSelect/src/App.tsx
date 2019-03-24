const React = require('react');
const mobx = require('mobx');
const mobxReact = require('mobx-react');
const lo = require('lodash');
const Browser = require('./components/Browser.tsx').Browser;
const Toolbar = require('./components/Toolbar.tsx').Toolbar;
const Breadcrumb = require('./components/Breadcrumb.tsx').Breadcrumb;
const Preview = require("./components/Preview.tsx").Preview;
const DeleteForm = require("./components/DeleteForm.tsx").DeleteForm;
const NewFolderForm = require('./components/NewFolderForm.tsx').NewFolderForm;
const Upload = require('./components/Upload.tsx').Upload;
let {observer, inject} = mobxReact;

import "toastr/build/toastr.min.css";

@inject("store")
@observer
export default class App extends React.Component {
    constructor(props){
        super(props);
        this.handleBrowserClick = this.handleBrowserClick.bind(this);
    }
    componentDidMount(){
        let store = this.props.store;
        store.initializeBrowse();
    }
    handleBrowserClick(evt){
        evt.preventDefault();
        let store = this.props.store;
        store.clearSelection();
    }
    render() {
        let store = this.props.store;
        let renderDom = [
            <div className="row" key="content">
                <div className="col-8">
                    <div className="card">
                        <div className="card-block">
                            <div className="card-block-smallpadding">
                                <div className="row">
                                    <Breadcrumb />
                                </div>
                                <div className="row">
                                    <Toolbar />
                                </div>
                                {store.mode == "upload" && 
                                    <div className="row">
                                        <Upload />
                                    </div>
                                }
                                {store.mode == "newfolder" && 
                                    <div className="row">
                                        <NewFolderForm />
                                    </div>
                                }
                                {store.mode == "browse" && 
                                    <div className={"row small-gutters"} 
                                        style={{ "height": "60vh", "overflowY": "scroll" }}
                                        onClick={this.handleBrowserClick}>
                                        <Browser />
                                    </div>
                                }
                                {store.mode == "deleteFolder" &&
                                    <div className="row">
                                        <DeleteForm />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    {store.mode == "browse" && 
                        <Preview />
                    }
                </div>
            </div>
        ];
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