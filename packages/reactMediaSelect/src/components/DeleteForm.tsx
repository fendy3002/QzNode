let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
let lo = require('lodash');

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
        store.toggleDeleteFolder();
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
        const message = <>
            <>Are you sure to delete folder&nbsp;</>
            <b>{newFolderStore.existingPath}</b>
            {store.files.length > 0 && <>&nbsp;and it's contents</>}
            <>?</>
        </>;
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