'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _consoleLog = require('./consoleLog.js');

var _consoleLog2 = _interopRequireDefault(_consoleLog);

var _emptyLog = require('./emptyLog.js');

var _emptyLog2 = _interopRequireDefault(_emptyLog);

var _fileLog = require('./fileLog.js');

var _fileLog2 = _interopRequireDefault(_fileLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
    console: _consoleLog2.default,
    empty: _emptyLog2.default,
    file: _fileLog2.default
};

exports.default = Service;