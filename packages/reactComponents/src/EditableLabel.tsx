const React = require('react');
const lo = require('lodash');

let TextContext = React.createContext({
    text: ""
});

interface EditableLabelState{
    editing: boolean,
    text: string
}
interface EditableLabelProps{
    value: string,
    onChange: (val: string) => void,
    [key: string]: any
}

export class EditableLabel extends React.Component<EditableLabelProps, EditableLabelState> {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            text: null
        };
        
        this.labelClicked = this.labelClicked.bind(this);
        this.inputLostFocus = this.inputLostFocus.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.textChanged = this.textChanged.bind(this);
    }
    labelClicked(evt) {
        this.setState({ 
            editing: true,
            text: this.props.value
        });
    }
    inputLostFocus(process) {
        return (evt) => {
            if(process && this.props.value != this.state.text){
                if(confirm(this.props.confirmMessage || "Are you sure?")){
                    if(this.props.onChange){
                        this.props.onChange({
                            target: evt.target,
                            currentTarget: evt.currentTarget,
                            value: this.state.text
                        });
                    }
                }
            }

            this.setState({ editing: false });
        }
    }
    textChanged(evt){
        this.setState({ text: evt.target.value });
    }
    keyPressed(event) {
        if(event.key == 'Enter') {
            this.inputLostFocus(true)(event);
        }
    }
    keyUp(event) {
        if(event.key == "Escape" || event.key == "Esc"){
            this.inputLostFocus(false)(event);
        }
    }

    static Value = () => {
        return <TextContext.Consumer>
            {text => {
                return text.text || "";
            }}
        </TextContext.Consumer>;
    }

    render() {
        if(this.state.editing){
            let dataProps = {};
            lo.forOwn(this.props, (val, key) => {
                if(key.startsWith("data")){
                    dataProps[key] = val;
                }
            });
            return <input 
                type='text'
                {...dataProps}
                className={this.props.inputClassName}
                style={this.props.inputStyle || {}}
                onChange={this.textChanged}
                onBlur={this.inputLostFocus(true)}
                onKeyPress={this.keyPressed}
                onKeyUp={this.keyUp}
                value={this.state.text}
                autoFocus
            />;
        }

        return <label onClick={this.labelClicked}
            style={this.props.style}
            className={this.props.className}>
            <TextContext.Provider value={{ text: this.props.value }}>
                {this.props.children}
            </TextContext.Provider>
        </label>;
    }
};