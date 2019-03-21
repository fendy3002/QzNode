let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
let lo = require('lodash');

let {observer, inject} = mobxReact;

@inject("store")
@observer
export class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(evt){
        evt.preventDefault();
        const store = this.props.store;
        const navigate = store.navigate;
        const newPath = evt.currentTarget.dataset.path;

        navigate(newPath);
    }
    render() {
        let store = this.props.store;
        return <div className="col-12">
                <nav>
                    <ol className="breadcrumb" style={{ "marginBottom": "8px" }}>
                        <li className="breadcrumb-item">
                            <a href="#" onClick={this.handleClick} data-path="/">media</a>
                        </li>
                        {store.breadcrumb.map((crumb, index) => (
                            <React.Fragment key={"breadcrumb_" + index}>
                                {crumb.last &&
                                    <li className="breadcrumb-item active">{ crumb.label }</li>
                                }
                                {!crumb.last &&
                                    <li className="breadcrumb-item">
                                        <a href="#" data-path={crumb.url} onClick={this.handleClick}>{ crumb.label }</a>
                                    </li>
                                }
                            </React.Fragment>
                        ))}
                    </ol>
                </nav>
            </div>;
    }
};