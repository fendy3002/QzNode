'use strict';

var chalk = require('chalk');
var commandLineArgs = require('command-line-args');

var helper = require('./helper.js');
var queue = require('./queue.js');
var uuid = require('./uuid.js');

var helpLine = "\n" + chalk.bold.underline("QzNode-cli") + "\n" + "\n" + "Utility Tools for Qz-Node Library\n" + "\n" + "Usage: exec.js <command> [options ...]\n" + "\n" + chalk.bold.underline("Available Commands") + "\n" + "\n" + "  " + chalk.green("uuid") + "\t Generate random uuid\n" + "  " + chalk.green("queue") + "\t Utilities for queue\n" + "  " + chalk.green("help") + "\t To show this page\n" + "\n";

var execService = function execService() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var commandOptionDefinitions = [{ name: 'command', type: String, multiple: true, defaultOption: true }];
    var options = commandLineArgs(commandOptionDefinitions, { partial: true, stopAtFirstUnknown: false });
    if (!options.command || options.command[0] == "help") {
        console.log(helpLine);
    } else if (options.command[0] == "queue") {
        queue(param);
    } else if (options.command[0] == "uuid") {
        uuid(param);
    }
};

module.exports = execService;