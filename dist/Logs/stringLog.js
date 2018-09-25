"use strict";
var Service = function (callback) {
    if (callback === void 0) { callback = function (err, message) { }; }
    var _data = "";
    var message = function (message) {
        _data += message;
        callback(null, message);
    };
    var messageln = function (message) {
        _data += message + "\n";
        callback(null, message);
    };
    var object = function (obj) {
        _data += JSON.stringify(obj) + "\n";
        callback(null, obj);
    };
    var exception = function (ex) {
        _data += ex.toString() + "\n";
        _data += ex.stack + "\n";
        callback(null, ex);
    };
    var clear = function () {
        _data = "";
    };
    return {
        message: message,
        messageln: messageln,
        object: object,
        exception: exception,
        data: function () {
            return _data;
        },
        clear: clear
    };
};
module.exports = Service;
