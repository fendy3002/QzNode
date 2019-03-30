const React = require('react');
const mobx = require('mobx');
const mobxReact = require('mobx-react');
const lo = require('lodash');
const Dropzone = require('react-dropzone').default;

const {observer, inject} = mobxReact;

const baseStyle = {
    height: 200,
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: "8px"
};
  
const activeStyle = {
    borderStyle: 'solid',
    borderColor: '#6c6',
    backgroundColor: '#eee'
};
  
const acceptStyle = {
    borderStyle: 'solid',
    borderColor: '#00e676'
};
  
const rejectStyle = {
    borderStyle: 'solid',
    borderColor: '#ff1744'
};

@inject("store")
@observer
export class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleChangeOverwrite = this.handleChangeOverwrite.bind(this);
    }
    handleDrop(acceptedFiles){
        const store = this.props.store;
        store.upload(acceptedFiles);
    }
    handleChangeOverwrite(evt){
        const store = this.props.store;
        store.uploadOverwrite = evt.target.checked;
    }
    render() {
        let store = this.props.store;
        let config = store.context.config;
        return <div className="col">
            {
                config.access.deleteFile &&
                    <div className="row">
                        <div className="col">
                            <label>
                                <input className="checkbox" type="checkbox" id="uploadOverwrite" checked={store.uploadOverwrite} onChange={this.handleChangeOverwrite} />
                                <span>Overwrite File</span>
                            </label>
                        </div>
                    </div>
            }
            <div className="row" style={{marginBottom: "8px"}}>
                <Dropzone onDrop={this.handleDrop }>
                    {({getRootProps, getInputProps}) => (
                        <section className="col">
                            <div className="text-center" {...getRootProps({style: baseStyle})}>
                                <input {...getInputProps()} />
                                <p style={{ marginTop: "80px" }}>Drop files here or click to upload</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        </div>;
    }
};