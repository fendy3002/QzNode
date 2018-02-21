import chalk from 'chalk';
import commandLineArgs from 'command-line-args';

import uuid from '../Uuid/index.js';

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

export default execService;