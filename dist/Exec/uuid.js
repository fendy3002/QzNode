'use strict';

var chalk = require('chalk');
var commandLineArgs = require('command-line-args');

var uuid = require('../Uuid/index');

var helpLine = "\n" + chalk.bold.underline("QzNode-cli") + " \n" + "\n" + "Generate random uuid string\n" + "\n" + "Usage: exec.js uuid [options ...]\n" + "\n" + chalk.bold.underline("Options") + " \n" + "\n" + "  " + chalk.yellow("-h") + ", " + chalk.yellow("--help") + "\t Show this page\n" + "\n";

var execService = function execService() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var commandOptionDefinitions = [{ name: 'help', alias: 'h', type: Boolean, multiple: false }];
    var options = commandLineArgs(commandOptionDefinitions, { partial: true, stopAtFirstUnknown: false });
    if (options.help) {
        console.log(helpLine);
    } else {
        console.log(uuid());
    }
};

module.exports = execService;