const React = require('react');
const lo = require('lodash');
const PropTypes = require('prop-types');

export class PageLimit extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(evt){
        let {onChange} = this.props;
        onChange({
            ...evt,
            value: parseInt(evt.target.value)
        });
    }
    render() {
        let {options, value} = this.props;
        let useOptions = [...lo.sortBy(options)];

        if(!useOptions || useOptions.length == 0){
            useOptions = [value];
        }
        else if(useOptions.indexOf(value) < 0){
            // if val < first
            if(useOptions[0] > value){
                useOptions = [
                    value,
                    ...useOptions
                ];
            }
            // if val > last
            else if(useOptions[useOptions.length - 1] < value){
                useOptions = [
                    ...useOptions,
                    value
                ];
            }
            else{
                for(let i = 0; i < useOptions.length; i ++){
                    if(useOptions[i] > value){
                        useOptions.splice(i - 1, 0, value);
                        break;
                    }
                }
            }
        }
        let selectProps = {};
        lo.forOwn(this.props, (val, key) => {
            if(['options', 'value', 'onChange'].indexOf(key) < 0){
                selectProps[key] = val;
            }
        })
        return <select value={value} onChange={this.handleOnChange} {...selectProps}>
            {useOptions.map((opt) => (
                <option value={opt} key={opt}>{opt}</option>
            ))}
        </select>;
    }
};
PageLimit.propTypes = {
    value: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.number).isRequired
};