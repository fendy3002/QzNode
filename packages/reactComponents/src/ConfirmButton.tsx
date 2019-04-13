const React = require('react');
const onClickOutside = require('react-onclickoutside');

const submitHandler = function(confirmButton){
    let result :any = {
        isAsync: () => false,
        done: () => confirmButton.onChangeMode("submit")
    };

    return result;
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
        if(mode == "confirm" || mode == "confirming" || mode == "confirmation"){
            this.setState({mode: "confirm"});
        }
        else if(mode == "submit" || mode == "submitted"){
            this.setState({mode: "submit"});
        }
        else if(mode == "submitting"){
            this.setState({mode: "submitting"});
        }
        else if(mode == "delay" || mode == "delayed"){
            this.setState({mode: "delay"});
        }
        else{
            if(this.state.mode != "submit" && this.state.mode != "submitting"){
                this.setState({mode: ""});
            }
        }
    }

    onSubmitting(evt){
        const handleClick = this.props.onClick;
        const eventHandler = submitHandler(this);

        this.onChangeMode("submitting");
        const result = handleClick(evt, eventHandler);
        if(result !== false){
            this.onChangeMode("submit");
        }
    }

    onConfirming(k){
        const delay = this.props.delay || {};
        const delayTime = delay.time || 0;
        if(delayTime === 0 || delayTime < 50){
            this.onChangeMode("confirm");
        }
        else{
            const onChangeMode = this.onChangeMode;
            onChangeMode("delay");

            const handler = setTimeout(function(){
                onChangeMode("confirm");
            }, delayTime);

            this.setState({delayHandler: handler});
        }
    }

    handleClickOutside(evt) {
        if(this.state.delayHandler){
            clearTimeout(this.state.delayHandler);
        }
        this.onChangeMode("");
    }

    render() {
        const {mode} = this.state;
        if(mode == "confirm"){
            const confirmation = this.props.confirmation || {};
            const className = confirmation.className || this.props.className;
            const style = confirmation.style || this.props.style;

            let content = confirmation.content || "Confirm ?";
            if (typeof content === "function") {
                content = content();
            }
            const onSubmitting = this.onSubmitting;
            return <button type="button" className={className}
                style={style} onClick={(k)=> onSubmitting(k)}>
                {content}
                </button>;
        }
        else if(mode == "submit"){
            const submitted = this.props.submitted || {};
            const willDisable = submitted.willDisable || false;

            const className = submitted.className || this.props.className;
            const style = submitted.style || this.props.style;
            let content = submitted.content || this.state.content;

            if (typeof content === "function") {
                content = content();
            }

            if(this.props.submitted && this.props.submitted.content){
                return content;
            }
            else{
                const onConfirming = this.onConfirming;
                return <button type="button" className={this.props.className}
                    style={this.props.style} disabled={willDisable}
                    onClick={k => onConfirming(k)}>
                        {content}
                    </button>;
            }
        }
        else if(mode == "delay" || mode == "submitting"){
            const delay = this.props.delay || {};
            const delayContent = delay.content;
            let content = delayContent || "Loading...";

            if(typeof content === "function"){
                content = content();
            }

            return <button type="button" className={this.props.className}
                style={this.props.style} disabled>
                    {content}
                </button>;
        }
        else{
            let content = this.state.content;
            if(typeof content === "function"){
                content = content();
            }
            const onConfirming = this.onConfirming;
            return <button type="button" className={this.props.className}
                style={this.props.style} onClick={k => onConfirming(k)}>
                    {content}
                </button>;
        }
    }
};
export const ConfirmButton = onClickOutside(Confirm);