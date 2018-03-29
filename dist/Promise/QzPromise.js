"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QzPromise = function QzPromise(callback) {
    var before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck3.default)(this, QzPromise);

    this.callback = callback;
    this.before = before;
    this.then = function (thenCallback) {
        return new QzPromise(thenCallback, this);
    };
};

;

exports.default = QzPromise;