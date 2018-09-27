"use strict";
var lo = require('lodash');
var arrToSet = function (arr, valHandler, keyHandler) {
    if (!valHandler) {
        valHandler = function (val, index) { return true; };
    }
    if (!keyHandler) {
        keyHandler = function (val, index) {
            return val;
        };
    }
    var result = {};
    arr.forEach(function (ele, index) {
        var key = keyHandler(ele, index);
        if (!result[key]) {
            result[key] = valHandler(ele, index);
        }
        else if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].concat(valHandler(ele, index));
        }
    });
    return result;
};
var setToArr = function (data, handler) {
    if (handler === void 0) { handler = function (val, key) { return val; }; }
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
