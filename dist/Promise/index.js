'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _QzPromise = require('./QzPromise.js');

var _QzPromise2 = _interopRequireDefault(_QzPromise);

var _limit = require('./limit.js');

var _limit2 = _interopRequireDefault(_limit);

var _retry = require('./retry.js');

var _retry2 = _interopRequireDefault(_retry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service(callback) {
    return new _QzPromise2.default(callback);
};

Service.limit = _limit2.default;
Service.retry = _retry2.default;

exports.default = Service;