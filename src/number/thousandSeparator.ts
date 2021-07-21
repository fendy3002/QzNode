// from https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
const isNumeric = (value) => {
    return !isNaN(value - parseFloat(value));
}

// from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x, option?: any) => {
    let useOption = {
        thousandSymbol: ",",
        decimalSymbol: ".",
        ...option
    }
    if (!x) { return ""; }
    if (!isNumeric(x)) {
        return x;
    }

    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, useOption.thousandSymbol);
    return parts.join(useOption.decimalSymbol);
}

export default numberWithCommas;