"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Service = function Service() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    var _data = "";
    var message = function message(_message) {
        _data += _message;
        callback(null, _message);
    };
    var messageln = function messageln(message) {
        _data += message + "\n";
        callback(null, message);
    };
    var object = function object(obj) {
        _data += JSON.stringify(obj) + "\n";
        callback(null, obj);
    };
    var exception = function exception(ex) {
        _data += ex.toString() + "\n";
        _data += ex.stack + "\n";
        callback(null, ex);
    };
    var clear = function clear() {
        _data = "";
    };

    return {
        message: message,
        messageln: messageln,
        object: object,
        exception: exception,
        data: function data() {
            return _data;
        },
        clear: clear
    };
};

exports.default = Service;