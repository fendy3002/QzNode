let chalk = require('chalk');
let commandLineArgs = require('command-line-args');

let helper = require('./helper.js');
let queue = require('./queue.js');
let uuid = require('./uuid.js');

let helpLine = "\n" +
        chalk.bold.underline("QzNode-cli") + "\n" +
        "\n" +
        "Utility Tools for Qz-Node Library\n" +
        "\n" +
        "Usage: exec.js <command> [options ...]\n" +
        "\n" +
        chalk.bold.underline("Available Commands") + "\n" +
        "\n" +
        "  " + chalk.green("uuid")+ "\t Generate random uuid\n" +
        "  " + chalk.green("queue") + "\t Utilities for queue\n" +
        "  " + chalk.green("help") + "\t To show this page\n" +
        "\n";

let execService = (param = {}) => {
    const commandOptionDefinitions = [
        { name: 'command', type: String, multiple: true, defaultOption: true }
    ];
    const options = commandLineArgs(commandOptionDefinitions, { partial: true, stopAtFirstUnknown: false });
    if(!options.command || options.command[0] == "help"){
        console.log(helpLine);
    }
    else if(options.command[0] == "queue"){
        queue(param);
    }
    else if(options.command[0] == "uuid"){
        uuid(param);
    }
};

module.exports = execService;