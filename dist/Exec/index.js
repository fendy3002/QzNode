'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _helper = require('./helper.js');

var _helper2 = _interopRequireDefault(_helper);

var _queue = require('./queue.js');

var _queue2 = _interopRequireDefault(_queue);

var _uuid = require('./uuid.js');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpLine = "\n" + _chalk2.default.bold.underline("QzNode-cli") + "\n" + "\n" + "Utility Tools for Qz-Node Library\n" + "\n" + "Usage: exec.js <command> [options ...]\n" + "\n" + _chalk2.default.bold.underline("Available Commands") + "\n" + "\n" + "  " + _chalk2.default.green("uuid") + "\t Generate random uuid\n" + "  " + _chalk2.default.green("queue") + "\t Utilities for queue\n" + "  " + _chalk2.default.green("help") + "\t To show this page\n" + "\n";

var execService = function execService() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var commandOptionDefinitions = [{ name: 'command', type: String, multiple: true, defaultOption: true }];
    var options = (0, _commandLineArgs2.default)(commandOptionDefinitions, { partial: true, stopAtFirstUnknown: false });
    if (!options.command || options.command[0] == "help") {
        console.log(helpLine);
    } else if (options.command[0] == "queue") {
        (0, _queue2.default)(param);
    } else if (options.command[0] == "uuid") {
        (0, _uuid2.default)(param);
    }
};

exports.default = execService;