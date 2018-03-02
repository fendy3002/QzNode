'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpLine = "\n" + _chalk2.default.bold.underline("QzNode-cli") + " \n" + "\n" + "Utilities for queue\n" + "\n" + "Usage: exec.js queue [options ...]\n" + "\n" + _chalk2.default.bold.underline("Available Commands") + " \n" + "\n" + "  " + _chalk2.default.green("pending") + "\t To list all pending queue\n" + "  " + _chalk2.default.green("running") + "\t To list all running queue\n" + "  " + _chalk2.default.green("failed") + "\t To list all failed queue\n" + "\n" + _chalk2.default.bold.underline("Options") + " \n" + "\n" + "  " + _chalk2.default.yellow("-h") + ", " + _chalk2.default.yellow("--help") + "\t Show this page\n" + "\n";

var pendingHelp = "QzNode Pending Queue\n" + "====================\n" + "List all pending queue \n" + "Options \n" + "-h, --help\t Display this page" + "-t, --tag\t Filter queue to display by tag\n";

var execService = function execService() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var commandOptionDefinitions = [{ name: 'command', type: String, multiple: true, defaultOption: true }, { name: 'tag', alias: 't', type: String, multiple: true }, { name: 'help', alias: 'h', type: Boolean, multiple: false }];
    var options = (0, _commandLineArgs2.default)(commandOptionDefinitions, { partial: true, stopAtFirstUnknown: false });
    if (!options.command[1] || options.command[1] == "help") {
        console.log(helpLine);
    } else if (options.command[1] == "pending") {
        if (options.help) {
            console.log(pendingHelp);
        }
    }
};

exports.default = execService;