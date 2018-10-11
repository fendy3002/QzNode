"use strict";
var Service = function (callback) {
    if (callback === void 0) { callback = function (err, message) { }; }
    var _ = {
        stdout: process.stdout
    };
    var message = function (message) {
        _.stdout.write(message);
        callback(null, message);
    };
    var messageln = function (message) {
        _.stdout.write(message + "\n");
        callback(null, message);
    };
    var object = function (obj) {
        _.stdout.write(JSON.stringify(obj, null, 2) + "\n");
        callback(null, obj);
    };
    var exception = function (ex) {
        _.stdout.write(ex.toString());
        _.stdout.write(ex.stack);
        callback(null, ex);
    };
    return {
        _: _,
        message: message,
        messageln: messageln,
        object: object,
        exception: exception,
    };
};
module.exports = Service;
