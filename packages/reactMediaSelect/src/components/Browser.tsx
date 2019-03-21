const React = require('react');
const path = require('path');
const mobx = require('mobx');
const mobxReact = require('mobx-react');
const lo = require('lodash');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class Browser extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(evt){
        evt.preventDefault();
        const store = this.props.store;
        const fileName = evt.currentTarget.dataset.file;
        if(evt.currentTarget.dataset.directory == "true"){
            store.navigate(path.join("/", store.currentPath, fileName));
        } else {
            store.selectFile(fileName);
        }
    }
    render() {
        let store = this.props.store;
        let {files} = store;
        return files.map((file, index) => {
            let fileStyle = {};
            let fileNameStyle = {};
            if(store.selected == file.name){
                fileStyle = {
                    border: "2px solid #52BCD3"
                };
                fileNameStyle = {
                    backgroundColor: "#52BCD3",
                    color: "#FFFFFF"
                };
            }
            return <React.Fragment key={"file_" + index}>
                <div className="col-md-3">
                    <a href={ "#" } onClick={this.handleClick} 
                        data-index={index} data-file={file.name}
                        data-directory={file.directory}>
                        <div className="card" style={{"border": "1px solid rgba(0, 0, 0, 0.125)"}}>
                            <div className="card-block" style={{ ...fileStyle }}>
                                <div className="card-block-smallpadding">
                                    {file.directory &&
                                        <img className="img-fluid" src="/images/folder.svg" />
                                    }
                                    {!file.directory &&
                                        <>
                                        {file.isImage &&
                                            <img className="img-fluid" src={store.contentPath(file.name)} 
                                                style={{"overflow": "hidden", "maxHeight":"140px"}}/>
                                        }
                                        {!file.isImage &&
                                            <img className="img-fluid" src="/images/file.png"/>
                                        }
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="card-footer" style={{ ...fileNameStyle  }}>
                                <div className="card-block-smallpadding">
                                    <span style={{ fontSize: "0.8em", "fontWeight": "bold"}}>
                                        { file.name }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                {(index % 4 == 0) &&
                    <div className="clearfix"></div>
                }
            </React.Fragment>;
        });
    }
};