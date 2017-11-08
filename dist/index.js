"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./Promise/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./Logs/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service() {
    return {
        promise: _index2.default,
        logs: _index4.default
    };
};

exports.default = Service;