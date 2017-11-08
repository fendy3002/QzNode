"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service(log, options) {
    var _ = (0, _extends3.default)({
        prefix: ''
    }, options);

    var prefix = function prefix() {
        return _.prefix;
    };

    var message = function message(_message) {
        log.message(prefix() + " " + _message);
    };
    var messageln = function messageln(message) {
        log.messageln(prefix() + " " + message);
    };
    var object = function object(obj) {
        log.message(prefix() + " ");
        log.object(obj);
    };
    var exception = function exception(ex) {
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

exports.default = Service;