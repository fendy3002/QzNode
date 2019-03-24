const React = require('react');
const mobx = require('mobx');
const mobxReact = require('mobx-react');
const lo = require('lodash');
const path = require('path');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class DeleteForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCancel(){
        const store = this.props.store;
        store.mode = "browse";
    }
    handleSubmit(evt){
        evt.preventDefault();
        const store = this.props.store;
        if(!this.props.file){
            store.submitDeleteFolder();
        }
        else {
            store.submitDeleteFile();
        }
    }
    handleChange(evt){
        evt.preventDefault();
        const store = this.props.store;
        const value = evt.target.value;
        store.newFolderStore.changeNewFolderName(value);
    }
    render() {
        let store = this.props.store;
        const newFolderStore = store.newFolderStore;
        let message = <></>;
        if(!this.props.file){
            message = <>
                <>Are you sure to delete folder&nbsp;</>
                <b>{newFolderStore.existingPath}</b>
                {store.files.length > 0 && <>&nbsp;and it's contents</>}
                <>?</>
            </>;
        } else {
            message = <>
                <>Are you sure to delete file&nbsp;</>
                <b>{path.join(newFolderStore.existingPath, store.selected)}</b>
                <>?</>
            </>;
        }
        return <div className="col-12">
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col form-group">
                        <span>{message}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button className="btn btn-secondary" type="button" onClick={this.handleCancel}>
                            Cancel
                        </button>&nbsp;
                        <button className="btn btn-danger" type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>;
    }
};