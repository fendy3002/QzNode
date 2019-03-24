const React = require('react');
const path = require('path');
const mobx = require('mobx');
const mobxReact = require('mobx-react');
const lo = require('lodash');
import fileIcon from '../../asset/file.png';

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCancel(){
        const store = this.props.store;
        const config = store.context.config;
        config.fileAction.cancel.handler();
    }
    handleSubmit(){
        const store = this.props.store;
        const config = store.context.config;

        const filePath = path.join("/", store.currentPath, store.selected);
        config.fileAction.submit.handler(filePath);
    }
    render() {
        const store = this.props.store;
        const config = store.context.config;
        console.log(config);
        if(!store.selected){
            return <></>;
        }
        return <div className="card">
            <div className="card-header bordered">
                <div className="container">
                    <span style={{ fontSize: "0.8em", "fontWeight": "bold" }}>
                        { store.selected }
                    </span>
                </div>
            </div>
            <div className="card-block" style={{ height: "386px" }}>
                <div className="card-block-smallpadding text-center">
                    { store.selectedFile.isImage &&
                        <img src={store.contentPath(store.selected)} className="img-fluid" style={{ "maxHeight": "360px" }}/>
                    }
                    { !store.selectedFile.isImage &&
                        <img src={fileIcon} className="img-fluid" style={{ "maxHeight": "360px" }}/>
                    }
                </div>
            </div>
            <div className="card-footer">
                <div className="card-footer-smallpadding text-right">
                    {config.access.deleteFile && <>
                        <button type="button" className="btn btn-danger">
                            Delete
                        </button>&nbsp;
                    </>}
                    {config.fileAction.cancel && <>
                        <button type="button" className="btn btn-secondary" onClick={this.handleCancel}>
                            {config.fileAction.cancel.label || "Cancel" }
                        </button>&nbsp;
                    </>}
                    {config.fileAction.submit && <>
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>
                            {config.fileAction.submit.label || "Submit" }
                        </button>&nbsp;
                    </>}
                </div>
            </div>
        </div>;
    }
};