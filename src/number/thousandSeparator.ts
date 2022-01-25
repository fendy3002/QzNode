import * as types from '../types';
/**
 * @module number
 */
// from https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
const isNumeric = (value) => {
    return !isNaN(value - parseFloat(value));
};

// from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
/**
 * Format a number with thousand separator
 * @param value {number} number that want to be formatted
 * @param [option] {Object} formatting option
 * @param [option.thousandSymbol] {string} character used for thousand separator
 * @param [option.decimalSymbol] {string} character used for decimal separator
 * @returns {string}
 */
export const thousandSeparator: types.Number.thousandSeparator = (value, option) => {
    let useOption = {
        thousandSymbol: ",",
        decimalSymbol: ".",
        ...option
    }
    if (!value) { return ""; }
    if (!isNumeric(value)) {
        throw new Error("value must be a valid number");
    }

    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, useOption.thousandSymbol);
    return parts.join(useOption.decimalSymbol);
};