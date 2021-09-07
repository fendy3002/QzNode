import * as React from 'react';
import { checkPropTypes } from "prop-types";
import format from './helper/format';
import validate from './helper/validate';

const DefaultInput = React.forwardRef((props: any, ref) => {
    return <>
        <input type="text" ref={ref} {...props} />
    </>
});

const getSelectionIndexFromValue = (value, baseSelection) => {
    let decimalValue = "";
    let decimalIndex = value.indexOf(".");
    let selectionAfterDecimal = 0;
    let selectionBeforeDecimal = baseSelection;

    if (decimalIndex > -1) {
        decimalValue = value.substring(value.indexOf("."));
        selectionAfterDecimal = Math.max(baseSelection - decimalIndex, 0);
        selectionBeforeDecimal = baseSelection - selectionAfterDecimal;
    }

    let leadingDigit = (value.length - decimalValue.length) % 4;
    if (selectionBeforeDecimal < leadingDigit) { return selectionBeforeDecimal; }

    let separatorOccurance = Math.floor(((3 - leadingDigit) + selectionBeforeDecimal) / 4);
    return selectionBeforeDecimal - separatorOccurance + selectionAfterDecimal;
};

class NumericInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.displayRef = React.createRef();
    }
    inputRef;
    displayRef;

    componentDidMount() {
        let { onChange, allowEmpty } = this.props;
        this.inputRef.current.style.display = "none";
        this.displayRef.current.addEventListener("mousedown", () => {
            this.displayRef.current.eventTrigger = "mousedown";
        });
        this.displayRef.current.addEventListener("mouseup", () => {
            this.displayRef.current.eventTrigger = null;
            this.inputRef.current.style.display = "";
            this.displayRef.current.style.display = "none";
            this.inputRef.current.focus();

            if (this.inputRef.current.value == "0") {
                this.inputRef.current.setSelectionRange(0, 1);
            }
            else {
                let selectionStart = getSelectionIndexFromValue(this.displayRef.current.value, this.displayRef.current.selectionStart);
                this.inputRef.current.setSelectionRange(selectionStart, selectionStart);
            }
        });
        this.displayRef.current.addEventListener("focus", () => {
            if (this.displayRef.current.eventTrigger != "mousedown") {
                this.inputRef.current.style.display = "";
                this.displayRef.current.style.display = "none";
                this.inputRef.current.focus();
                if (this.inputRef.current.value == "0") {
                    this.inputRef.current.setSelectionRange(0, 1);
                }
            }
        });
        this.inputRef.current.addEventListener("blur", (evt) => {
            this.displayRef.current.style.display = "";
            this.inputRef.current.style.display = "none";
            if (this.inputRef.current.value == "" && !allowEmpty) {
                this.inputRef.current.value = "0";
                onChange(evt);
            } else if (validate.string.isNumeric(this.inputRef.current.value)) {
                this.inputRef.current.value = parseFloat(this.inputRef.current.value).toString();
                onChange(evt);
            }
        });
    }
    render() {
        let InputComponent = this.props.inputComponent ?? DefaultInput;
        let NumberComponent = this.props.numberComponent ?? DefaultInput;

        let { value, onChange } = this.props;

        return <>
            <InputComponent ref={this.displayRef} value={format.number(value)} onChange={() => { }}></InputComponent>
            <NumberComponent ref={this.inputRef} value={value} onChange={onChange}></NumberComponent>
        </>;
    }
}
export { NumericInput };