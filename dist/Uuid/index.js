"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service() {
    return (0, _v2.default)().replace(/\-/g, "");
};

exports.default = Service;