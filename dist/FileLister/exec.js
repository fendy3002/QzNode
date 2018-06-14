'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _index = require('./reader/index.js');

var _index2 = _interopRequireDefault(_index);

var _output = require('./reader/output.js');

var _output2 = _interopRequireDefault(_output);

var _index3 = require('../index.js');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionDefinitions = [{ name: 'path', type: String, alias: 'p', multiple: false, defaultOption: true }, { name: 'pretty', type: Boolean, multiple: false }, { name: 'out', type: String, alias: 'o', multiple: false }, { name: 'log', type: String, multiple: false }];
var options = (0, _commandLineArgs2.default)(optionDefinitions);

if (!options.path) {
    console.log("Usage: node exec.js <path-to-list>");
} else {
    var path = options.path;
    var log = null;
    if (options.log) {
        log = (0, _index4.default)().logs.file(options.log);
    } else {
        log = (0, _index4.default)().logs.console();
    }
    new Promise((0, _index2.default)({
        log: log
    })(path)).then(function (result) {
        console.log(result);
        (0, _output2.default)(options)(result, function (err) {
            if (err) {
                log.messageln(err);
            }
        });
    });
}