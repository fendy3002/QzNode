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

var _index7 = require("./Exec/index.js");

var _index8 = _interopRequireDefault(_index7);

var _index9 = require("./Uuid/index.js");

var _index10 = _interopRequireDefault(_index9);

var _index11 = require("./Date/index.js");

var _index12 = _interopRequireDefault(_index11);

var _Require = require("./Require.js");

var _Require2 = _interopRequireDefault(_Require);

var _index13 = require("./Queue/index.js");

var _index14 = _interopRequireDefault(_index13);

var _index15 = require("./FileLister/index.js");

var _index16 = _interopRequireDefault(_index15);

var _index17 = require("./Time/index.js");

var _index18 = _interopRequireDefault(_index17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service() {
    return {
        exec: _index8.default,
        promise: _index2.default,
        logs: _index4.default,
        date: _index12.default,
        io: _index6.default,
        uuid: _index10.default,
        require: _Require2.default,
        queue: _index14.default,
        fileLister: _index16.default,
        time: _index18.default
    };
};

exports.default = Service;