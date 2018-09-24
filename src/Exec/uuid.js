let chalk = require('chalk');
let commandLineArgs = require('command-line-args');

let uuid = require('../Uuid/index');

let helpLine = "\n" +
        chalk.bold.underline("QzNode-cli") + " \n" +
        "\n" +
        "Generate random uuid string\n" +
        "\n" +
        "Usage: exec.js uuid [options ...]\n" +
        "\n" +
        chalk.bold.underline("Options") + " \n" +
        "\n" +
        "  " + chalk.yellow("-h") + ", " + chalk.yellow("--help") + "\t Show this page\n" +
        "\n";

let execService = (param = {}) => {
    const commandOptionDefinitions = [
        { name: 'help', alias: 'h', type: Boolean, multiple: false }
    ];
    const options = commandLineArgs(commandOptionDefinitions, { partial:true, stopAtFirstUnknown: false });
    if(options.help){
        console.log(helpLine);
    }
    else{
        console.log(uuid());
    }
};

module.exports = execService;