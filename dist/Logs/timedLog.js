"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var moment = require('moment');
var Service = function (log, options) {
    var _ = __assign({ format: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]', date: function () { return moment().utc(); } }, options);
    var prefix = function () { return _.date().format(_.format); };
    var message = function (message) {
        log.message(prefix() + " " + message);
    };
    var messageln = function (message) {
        log.messageln(prefix() + " " + message);
    };
    var object = function (obj) {
        log.message(prefix() + " ");
        log.object(obj);
    };
    var exception = function (ex) {
        log.message(prefix() + " ");
        log.exception(ex);
    };
    return {
        _: _,
        message: message,
        messageln: messageln,
        object: object,
        exception: exception
    };
};
module.exports = Service;
