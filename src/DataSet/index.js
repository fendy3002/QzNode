let lo = require('lodash');

let arrToSet = (arr, handler = (val) => true) => {
    let result = {};
    arr.forEach(ele => {
        result[ele] = handler(ele);
    });
    return result;
};

let setToArr = (data, handler = (val, key) => val) => {
    let result = [];
    lo.forOwn(data, (value, key) => {
        result.push(handler(value, key));
    });
    return result;
};

let Service = {
    arrToSet,
    setToArr
};

module.exports = Service;