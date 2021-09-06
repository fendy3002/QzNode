import { checkPropTypes } from "prop-types";

const React = require('react');
const onClickOutside = require('react-onclickoutside').default;

let ButtonContext = React.createContext(null);
let ConfirmContext = React.createContext(null);

class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.displayRef = React.createRef();
    }
    componentDidMount() {

    }
    render() {
        let InputComponent = this.props.inputComponent ?? <input />;
        let NumberComponent = this.props.numberComponent ?? <input />;

        return <>
            <InputComponent ></InputComponent>
            <NumberComponent ></NumberComponent>
        </>;
    }
}
export { NumberInput };