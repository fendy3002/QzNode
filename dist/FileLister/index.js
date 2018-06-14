'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('./reader/index.js');

var _index2 = _interopRequireDefault(_index);

var _output = require('./reader/output.js');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service() {
    return {
        reader: _index2.default,
        readerOutput: _output2.default
    };
};
exports.default = Service;