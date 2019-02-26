const currency = (nunjucksEnv) => {
    nunjucksEnv.addFilter("currency", (val, option = {}) => {
        let currentOption = {
            thousandSeparator: ",",
            decimalSeparator: ".",
            sign: "",
            rounding: null,
            signOnFront: true,
            ...option,
        };

        let parts = val.toString().split(currentOption.decimalSeparator);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currentOption.thousandSeparator);
        if(currentOption.rounding && parts[1]){
            parts[1] = parts[1].substring(0, currentOption.rounding);
        }
        else if(currentOption.rounding === 0){
          parts = [parts[0]];
        }
        let result = parts.join(currentOption.decimalSeparator).trim();
        if(currentOption.sign && currentOption.signOnFront){
            result = currentOption.sign + " " + result;
        } else if(currentOption.sign) {
            result += " " + currentOption.sign;
        }
        return result;
    });
};
module.exports = currency;