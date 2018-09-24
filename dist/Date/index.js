"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var dateRangeToArray = function (from, to) {
    var fromDate = moment(from).startOf('day');
    var toDate = moment(to).startOf('day');
    var dayDiff = toDate.diff(fromDate, "days");
    var result = [];
    for (var i = 0; i <= dayDiff; i++) {
        result.push(moment(fromDate).add(i, "days"));
    }
    ;
    return result;
};
var dateDurationToArray = function (from, duration) {
    var fromDate = moment(from).startOf('day');
    var result = [];
    for (var i = 0; i < duration; i++) {
        result.push(moment(fromDate).add(i, "days"));
    }
    ;
    return result;
};
var Service = {
    dateRangeToArray: dateRangeToArray,
    dateDurationToArray: dateDurationToArray
};
exports.default = Service;
