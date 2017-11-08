"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Service = function Service() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    var _ = {
        stdout: process.stdout
    };

    var message = function message(_message) {
        _.stdout.write(_message);
        callback(null, _message);
    };
    var messageln = function messageln(message) {
        _.stdout.write(message + "\n");
        callback(null, message);
    };
    var object = function object(obj) {
        _.stdout.write(JSON.stringify(obj, null, 2) + "\n");
        callback(null, obj);
    };
    var exception = function exception(ex) {
        _.stdout.write(ex.toString());
        _.stdout.write(ex.stack);
        callback(null, ex);
    };

    return {
        message: message,
        messageln: messageln,
        object: object,
        exception: exception,
        _: _
    };
};

exports.default = Service;