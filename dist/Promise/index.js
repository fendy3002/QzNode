'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _limit = require('./limit.js');

var _limit2 = _interopRequireDefault(_limit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service(callback) {
    return {
        callback: callback
    };
};

Service.limit = _limit2.default;

exports.default = Service;