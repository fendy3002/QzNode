let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
let lo = require('lodash');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class NewFolderForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCancel(){
        const store = this.props.store;
        store.newFolderStore.changeNewFolderName("");
        store.toggleNewFolder();
    }
    handleSubmit(evt){
        evt.preventDefault();
        const store = this.props.store;
        store.newFolderStore.submit();
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
        return <div className="col-12">
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col form-group">
                        <span>Folder name: </span>
                        <label className="control-label">{ newFolderStore.existingPath }</label>
                        <input className="form-control underlined" 
                            style={{ width: "auto", display: "inline" }}
                            onChange={this.handleChange}
                            value={ newFolderStore.newFolderName }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button className="btn btn-secondary" type="button" onClick={this.handleCancel}>
                            Cancel
                        </button>&nbsp;
                        <button className="btn btn-primary" type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>;
    }
};