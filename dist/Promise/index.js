'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _limit = require('./limit.js');

var _limit2 = _interopRequireDefault(_limit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QzPromise = function QzPromise(callback) {
    var before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var result = {
        callback: callback,
        before: before,
        then: function then(thenCallback) {
            return QzPromise(thenCallback, result);
        }
    };

    return result;
};

var Service = function Service(callback) {
    return QzPromise(callback);
};

Service.limit = _limit2.default;

exports.default = Service;