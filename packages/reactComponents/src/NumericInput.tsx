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
            else if (validate.string.isNumeric(this.inputRef.current.value)) {
                let selectionStart = getSelectionIndexFromValue(this.displayRef.current.value, this.displayRef.current.selectionStart);
                let selectionEnd = this.displayRef.current.selectionEnd - this.displayRef.current.selectionStart + selectionStart;
                this.inputRef.current.setSelectionRange(selectionStart, selectionEnd);
            } else {
                this.inputRef.current.setSelectionRange(
                    this.displayRef.current.selectionStart, this.displayRef.current.selectionEnd
                );
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
        let baseInputComponent = this.props.inputComponent ?? <DefaultInput />;
        let baseNumberComponent = this.props.numberComponent ?? <DefaultInput />;

        let { value, onChange } = this.props;
        let overrideBaseDisplay: any = {};
        let overrideBaseNumber: any = {};
        if (this.props.name) {
            overrideBaseNumber.name = this.props.name;
        }
        if (this.props.placeholder) {
            overrideBaseNumber.placeholder = this.props.placeholder;
            overrideBaseDisplay.placeholder = this.props.placeholder;
        }
        if (this.props.className) {
            overrideBaseNumber.className = this.props.className;
            overrideBaseDisplay.className = this.props.className;
        }

        let InputComponent = React.cloneElement(
            baseInputComponent,
            {
                ref: this.displayRef,
                value: format.number(value),
                onChange: () => { },
                ...overrideBaseDisplay
            }
        );
        let NumberComponent = React.cloneElement(
            baseNumberComponent,
            {
                ref: this.inputRef,
                value: value,
                onChange: onChange,
                ...overrideBaseNumber,
            }
        );

        return <>
            {InputComponent}
            {NumberComponent}
        </>;
    }
}
export { NumericInput };