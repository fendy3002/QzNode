import chalk from 'chalk';
import commandLineArgs from 'command-line-args';

let helpLine = "\n" +
        chalk.bold.underline("QzNode-cli") + " \n" +
        "\n" +
        "Utilities for queue\n" +
        "\n" +
        "Usage: exec.js queue [options ...]\n" +
        "\n" +
        chalk.bold.underline("Available Commands") + " \n" +
        "\n" +
        "  " + chalk.green("pending") + "\t To list all pending queue\n" +
        "  " + chalk.green("running") + "\t To list all running queue\n" +
        "  " + chalk.green("failed") + "\t To list all failed queue\n" +
        "\n" +
        chalk.bold.underline("Options") + " \n" +
        "\n" +
        "  " + chalk.yellow("-h") + ", " + chalk.yellow("--help") + "\t Show this page\n" +
        "\n";

let pendingHelp = "QzNode Pending Queue\n" +
    "====================\n" +
    "List all pending queue \n" +
    "Options \n" +
    "-h, --help\t Display this page" +
    "-t, --tag\t Filter queue to display by tag\n";

let execService = (param = {}) => {
    const commandOptionDefinitions = [
        { name: 'command', type: String, multiple: true, defaultOption: true },
        { name: 'tag', alias: 't', type: String, multiple: true },
        { name: 'help', alias: 'h', type: Boolean, multiple: false }
    ];
    const options = commandLineArgs(commandOptionDefinitions, { partial:true, stopAtFirstUnknown: false });
    if(!options.command[1] || options.command[1] == "help"){
        console.log(helpLine);
    }
    else if(options.command[1] == "pending"){
        if(options.help){
            console.log(pendingHelp);
        }
    }
};

export default execService;