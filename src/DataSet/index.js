let lo = require('lodash');

let arrToSet = (arr, handler = (val, index) => true) => {
    let result = {};
    arr.forEach((ele, index) => {
        if(!result[ele]){
            result[ele] = handler(ele, index);
        }
        else if(result[ele] && Array.isArray(result[ele])){
            result[ele] = result[ele].concat(handler(ele, index));
        }
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