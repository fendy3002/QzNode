import * as types from '../types';
let consoleLog = require('./consoleLog');
let emptyLog = require('./emptyLog');
let prefixLog = require('./prefixLog');
let timedLog = require('./timedLog');
let prefixTimedLog = require('./prefixTimedLog');
let fileLog = require('./fileLog');

var Service = {
    console: consoleLog,
    empty: emptyLog,
    file: fileLog,
    prefix: prefixLog,
    prefixTimed: prefixTimedLog,
    timed: timedLog
};

export = Service;