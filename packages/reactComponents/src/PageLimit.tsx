const React = require('react');
const lo = require('lodash');
const PropTypes = require('prop-types');

export class PageLimit extends React.Component<any, any> {
    render() {
        let {options, value, onChange} = this.props;
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
        return <select value={value} onChange={onChange} {...selectProps}>
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