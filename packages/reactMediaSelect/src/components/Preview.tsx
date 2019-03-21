const React = require('react');
const path = require('path');
const mobx = require('mobx');
const mobxReact = require('mobx-react');
const lo = require('lodash');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class Preview extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let store = this.props.store;
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
                        <img src={"/images/file.png"} className="img-fluid" style={{ "maxHeight": "360px" }}/>
                    }
                </div>
            </div>
            <div className="card-footer">
                <div className="card-footer-smallpadding text-right">
                    <button type="button" className="btn btn-secondary">
                        Cancel
                    </button>&nbsp;
                    <button type="button" className="btn btn-primary">
                        Choose
                    </button>
                </div>
            </div>
        </div>;
    }
};