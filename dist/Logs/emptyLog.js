"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Service = function Service() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    var message = function message(_message) {
        callback(null, _message);
    };
    var messageln = function messageln(message) {
        callback(null, message);
    };
    var object = function object(obj) {
        callback(null, obj);
    };
    var exception = function exception(ex) {
        callback(null, ex);
    };

    return {
        message: message,
        messageln: messageln,
        object: object,
        exception: exception
    };
};

exports.default = Service;