import fs from 'fs';

import commandLineArgs from 'command-line-args';
import reader from './reader/index.js';
import readerOutput from './reader/output.js';
import readerLog from './reader/log.js';

const optionDefinitions = [
    { name: 'path', type: String, alias: 'p',multiple: false, defaultOption: true},
    { name: 'pretty', type: Boolean, multiple: false},
    { name: 'out', type: String, alias: 'o',multiple: false },
    { name: 'log', type: String,multiple: false }
];
var options = commandLineArgs(optionDefinitions);

export default () => {
    if(!options.path){
        console.log("Usage: node exec.js <path-to-list>");
    }
    else{
        var path = options.path;
        var log = readerLog(options);
        reader({
            log: log
        })(path, (result) => {
            readerOutput(options)(result, (err) => { if(err){ log(null, err); } });
        });
    }
}