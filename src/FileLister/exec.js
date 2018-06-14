import fs from 'fs';

import commandLineArgs from 'command-line-args';
import reader from './reader/index.js';
import readerOutput from './reader/output.js';
import qz from '../index.js';

const optionDefinitions = [
    { name: 'path', type: String, alias: 'p',multiple: false, defaultOption: true},
    { name: 'pretty', type: Boolean, multiple: false},
    { name: 'out', type: String, alias: 'o',multiple: false },
    { name: 'log', type: String,multiple: false }
];
let options = commandLineArgs(optionDefinitions);

if(!options.path){
    console.log("Usage: node exec.js <path-to-list>");
}
else{
    let path = options.path;
    let log = null;
    if(options.log){
        log = qz().logs.file(options.log);
    }
    else{
        log = qz().logs.console();
    }
    new Promise(reader({
        log: log
    })(path)).then((result) => {
        readerOutput(options)(result, (err) => { if(err){ log.messageln(err); } });
    });
}