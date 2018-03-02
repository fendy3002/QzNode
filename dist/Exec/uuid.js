'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _index = require('../Uuid/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpLine = "\n" + _chalk2.default.bold.underline("QzNode-cli") + " \n" + "\n" + "Generate random uuid string\n" + "\n" + "Usage: exec.js uuid [options ...]\n" + "\n" + _chalk2.default.bold.underline("Options") + " \n" + "\n" + "  " + _chalk2.default.yellow("-h") + ", " + _chalk2.default.yellow("--help") + "\t Show this page\n" + "\n";

var execService = function execService() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var commandOptionDefinitions = [{ name: 'help', alias: 'h', type: Boolean, multiple: false }];
    var options = (0, _commandLineArgs2.default)(commandOptionDefinitions, { partial: true, stopAtFirstUnknown: false });
    if (options.help) {
        console.log(helpLine);
    } else {
        console.log((0, _index2.default)());
    }
};

exports.default = execService;