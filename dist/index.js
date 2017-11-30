"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./Promise/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./Logs/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("./IO/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("./Uuid/index.js");

var _index8 = _interopRequireDefault(_index7);

var _Require = require("./Require.js");

var _Require2 = _interopRequireDefault(_Require);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service() {
    return {
        promise: _index2.default,
        logs: _index4.default,
        io: _index6.default,
        uuid: _index8.default,
        require: _Require2.default
    };
};

exports.default = Service;