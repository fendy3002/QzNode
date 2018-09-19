'use strict';

var lo = require('lodash');

var arrToSet = function arrToSet(arr) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (val) {
        return true;
    };

    var result = {};
    arr.forEach(function (ele) {
        result[ele] = handler(ele);
    });
    return result;
};

var setToArr = function setToArr(data) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (val, key) {
        return val;
    };

    var result = [];
    lo.forOwn(data, function (value, key) {
        result.push(handler(value, key));
    });
    return result;
};

var Service = {
    arrToSet: arrToSet,
    setToArr: setToArr
};

module.exports = Service;