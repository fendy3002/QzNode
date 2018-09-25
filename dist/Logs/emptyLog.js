"use strict";
var Service = function (callback) {
    if (callback === void 0) { callback = function (err, message) { }; }
    var message = function (message) {
        callback(null, message);
    };
    var messageln = function (message) {
        callback(null, message);
    };
    var object = function (obj) {
        callback(null, obj);
    };
    var exception = function (ex) {
        callback(null, ex);
    };
    return {
        message: message,
        messageln: messageln,
        object: object,
        exception: exception
    };
};
module.exports = Service;
