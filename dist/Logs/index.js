'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _consoleLog = require('./consoleLog.js');

var _consoleLog2 = _interopRequireDefault(_consoleLog);

var _emptyLog = require('./emptyLog.js');

var _emptyLog2 = _interopRequireDefault(_emptyLog);

var _prefixLog = require('./prefixLog.js');

var _prefixLog2 = _interopRequireDefault(_prefixLog);

var _timedLog = require('./timedLog.js');

var _timedLog2 = _interopRequireDefault(_timedLog);

var _prefixTimedLog = require('./prefixTimedLog.js');

var _prefixTimedLog2 = _interopRequireDefault(_prefixTimedLog);

var _fileLog = require('./fileLog.js');

var _fileLog2 = _interopRequireDefault(_fileLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
    console: _consoleLog2.default,
    empty: _emptyLog2.default,
    file: _fileLog2.default,
    prefix: _prefixLog2.default,
    prefixTimed: _prefixTimedLog2.default,
    timed: _timedLog2.default
};

exports.default = Service;