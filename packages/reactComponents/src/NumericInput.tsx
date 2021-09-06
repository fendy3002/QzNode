import * as React from 'react';
import { checkPropTypes } from "prop-types";
import format from './helper/format';
import validate from './helper/validate';

const onClickOutside = require('react-onclickoutside').default;

const DefaultInput = React.forwardRef((props: any, ref) => {
    return <>
        <input type="text" ref={ref} {...props} />
    </>
});

class NumericInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.displayRef = React.createRef();
    }
    inputRef;
    displayRef;

    componentDidMount() {
        let { onChange } = this.props;
        this.inputRef.current.style.display = "none";
        this.displayRef.current.addEventListener("focus", () => {
            this.inputRef.current.style.display = "";
            this.displayRef.current.style.display = "none";
            this.inputRef.current.focus();
        });
        this.inputRef.current.addEventListener("blur", (evt) => {
            this.displayRef.current.style.display = "";
            this.inputRef.current.style.display = "none";
        });
    }
    render() {
        let InputComponent = this.props.inputComponent ?? DefaultInput;
        let NumberComponent = this.props.numberComponent ?? DefaultInput;

        let { value, onChange } = this.props;
        let inputOnChange = (evt) => {
            if (validate.string.isNumeric(evt.currentTarget.value) &&
                evt.currentTarget.value[evt.currentTarget.value.length - 1] != ".") {
                evt.currentTarget.value = parseFloat(evt.currentTarget.value).toString();
            }
            return onChange(evt);
        };

        return <>
            <InputComponent ref={this.displayRef} value={format.number(value)} onChange={() => { }}></InputComponent>
            <NumberComponent ref={this.inputRef} value={value} onChange={inputOnChange}></NumberComponent>
        </>;
    }
}
export { NumericInput };