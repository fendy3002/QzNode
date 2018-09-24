let consoleLog = require('./consoleLog.js');
let emptyLog = require('./emptyLog.js');
let prefixLog = require('./prefixLog.js');
let timedLog = require('./timedLog.js');
let prefixTimedLog = require('./prefixTimedLog.js');
let fileLog = require('./fileLog.js');

var Service = {
    console: consoleLog,
    empty: emptyLog,
    file: fileLog,
    prefix: prefixLog,
    prefixTimed: prefixTimedLog,
    timed: timedLog
};

module.exports = Service;