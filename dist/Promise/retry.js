'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _QzPromise = require('./QzPromise.js');

var _QzPromise2 = _interopRequireDefault(_QzPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var retryService = function retryService(callback) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { retry: 1 };

    return new _QzPromise2.default(function (resolve, reject) {
        var execute = function execute() {
            var retry = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            return new Promise(callback).then(resolve).catch(function (err) {
                if (retry < opt.retry) {
                    execute(retry + 1);
                } else {
                    reject(err);
                }
            });
        };
        execute(0);
    });
};
exports.default = retryService;