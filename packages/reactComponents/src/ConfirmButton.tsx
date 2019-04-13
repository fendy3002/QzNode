import { checkPropTypes } from "prop-types";

const React = require('react');
const onClickOutside = require('react-onclickoutside').default;

let ButtonContext = React.createContext(null);
let ConfirmContext = React.createContext(null);

class ConfirmButtonTemplate extends React.Component{
    render(){
        if(this.props.children){
            return <ButtonContext.Consumer>
                {this.props.children}
            </ButtonContext.Consumer>;
        }
        return null;
    }
}
class ConfirmButtonConfirmTemplate extends React.Component{
    render(){
        if(this.props.children){
            return <ConfirmContext.Consumer>
                {this.props.children}
            </ConfirmContext.Consumer>;
        }
        return null;
    }
}

class ConfirmButtonLoadingTemplate extends React.Component{
    render(){
        if(this.props.children){
            return this.props.children;
        }
        return null;
    }
}
class ConfirmButtonSubmittedTemplate extends React.Component{
    render(){
        if(this.props.children){
            return this.props.children;
        }
        return null;
    }
}

interface clientSubmitType{
    (evt: any): Promise<void>
};

class Confirm extends React.Component<any, any> {
    constructor(props) {
        super(props);
        let content = this.props.children;
        if(!content){
            content = this.props.content;
        }

        this.state = {mode: "", content: content, delayHandler: null};
        this.onChangeMode = this.onChangeMode.bind(this);
        this.onConfirming = this.onConfirming.bind(this);
        this.onSubmitting = this.onSubmitting.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    onChangeMode(mode){
        this.setState((prev) => {
            return {
                ...prev,
                mode: mode
            };
        });
    }

    onSubmitting(evt){
        const onClientSubmit: clientSubmitType = this.props.onSubmit;
        this.onChangeMode("loading");

        onClientSubmit(evt).then(() => {
            this.onChangeMode("submit");
        }).catch((err) => {
            this.props.catchSubmit(evt, err);
            this.onChangeMode("");
        });
    }

    onConfirming(evt){
        const onChangeMode = this.onChangeMode;
        const onClientValidate = this.props.onValidate;
        if(onClientValidate){
            onChangeMode("loading");
            onClientValidate(evt).then(() => {
                onChangeMode("confirm");
            }).catch((err) => {
                onChangeMode("");
            });
        } else{
            const delay = this.props.delay || {};
            const delayTime = delay.time || 0;
            
            if(delayTime === 0 || delayTime < 50){
                onChangeMode("confirm");
            }
            else{
                onChangeMode("loading");
                const handler = setTimeout(function(){
                    this.setState((prev) => {
                        return {
                            ...prev,
                            delayHandler: null
                        };
                    });
                    onChangeMode("confirm");
                }.bind(this), delayTime);
                this.setState((prev) => {
                    return {
                        ...prev,
                        delayHandler: handler
                    };
                });
            }
        }
    }

    handleClickOutside(evt) {
        if(this.state.mode == "confirm"){
            this.onChangeMode("");
        }
        else if(this.state.delayHandler){
            clearTimeout(this.state.delayHandler);
            this.onChangeMode("");
        }
    }

    render() {
        const {mode} = this.state;
        let children = this.props.children;
        if(!Array.isArray(children)){
            children = [children];
        }
        let buttonTemplate = null;
        let confirmTemplate = null;
        let loadingTemplate = null;
        let submittedTemplate = null;
        children.forEach((elem) => {
            if(elem.type && elem.type.name == "ConfirmButtonTemplate"){
                buttonTemplate = <ButtonContext.Provider value={this.onConfirming}>
                    {elem}
                </ButtonContext.Provider>;
            }
            if(elem.type && elem.type.name == "ConfirmButtonConfirmTemplate"){
                confirmTemplate = <ConfirmContext.Provider value={this.onSubmitting}>
                    {elem}
                </ConfirmContext.Provider>;
            }
            if(elem.type && elem.type.name == "ConfirmButtonLoadingTemplate"){
                loadingTemplate = elem;
            }
            if(elem.type && elem.type.name == "ConfirmButtonSubmittedTemplate"){
                submittedTemplate = elem;
            }
        });

        return <div className={this.props.className} style={this.props.style || { display: "inline" }}>
            {!mode && buttonTemplate}
            {mode == "confirm" && confirmTemplate}
            {["loading", "delay", "submitting"].indexOf(mode) > -1 &&
                loadingTemplate
            }
            {["submit", "submitted"].indexOf(mode) > -1 &&
                submittedTemplate
            }
        </div>;
    }
};
const ConfirmButton = onClickOutside(Confirm);
ConfirmButton.Button = ConfirmButtonTemplate;
ConfirmButton.Confirm = ConfirmButtonConfirmTemplate;
ConfirmButton.Loading = ConfirmButtonLoadingTemplate;
ConfirmButton.Submitted = ConfirmButtonSubmittedTemplate;

export { ConfirmButton };