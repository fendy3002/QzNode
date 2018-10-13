"use strict";
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
/**
 *
 * @param {moment} time time to compare
 * @param {*} from HH:mm time format, marking the start time
 * @param {*} to HH:mm time format, marking the end time
 */
var isBetween = function (time, from, to) {
    var momentFrom = null;
    var momentTo = null;
    if (typeof from == "string") {
        momentFrom = moment.utc("2001-01-02 " + from + ":00", "YYYY-MM-DD HH:mm:ss");
    }
    else {
        momentFrom = from;
    }
    if (typeof to == "string") {
        momentTo = moment.utc("2001-01-02 " + to + ":00", "YYYY-MM-DD HH:mm:ss");
    }
    else {
        momentTo = to;
    }
    var timeOnly = moment.utc("2001-01-02 " + time.format("HH:mm") + ":00", "YYYY-MM-DD HH:mm:ss");
    if (Math.abs(momentFrom.diff(momentTo, "minutes")) < 1) { // ex: 10:00 to 10:00
        return Math.abs(timeOnly.diff(momentFrom, "minutes")) < 1;
    }
    else if (momentFrom < momentTo) { // ex: 06:00 to 12:00
        return timeOnly >= momentFrom && timeOnly <= momentTo;
    }
    else { // ex: 20:00 to 04:00
        var realmomentFrom = momentFrom.add(-1, "days");
        return timeOnly >= realmomentFrom && timeOnly <= momentTo;
    }
};
var Service = {
    isBetween: isBetween,
    dateRangeToArray: dateRangeToArray,
    dateDurationToArray: dateDurationToArray
};
module.exports = Service;
