"use strict";
var consoleLog = require('./consoleLog');
var emptyLog = require('./emptyLog');
var prefixLog = require('./prefixLog');
var timedLog = require('./timedLog');
var prefixTimedLog = require('./prefixTimedLog');
var fileLog = require('./fileLog');
var Service = {
    console: consoleLog,
    empty: emptyLog,
    file: fileLog,
    prefix: prefixLog,
    prefixTimed: prefixTimedLog,
    timed: timedLog
};
module.exports = Service;
