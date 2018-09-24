"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lo = require('lodash');
var arrToSet = function (arr, handler) {
    if (handler === void 0) { handler = function (val, index) { return true; }; }
    var result = {};
    arr.forEach(function (ele, index) {
        if (!result[ele]) {
            result[ele] = handler(ele, index);
        }
        else if (result[ele] && Array.isArray(result[ele])) {
            result[ele] = result[ele].concat(handler(ele, index));
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
