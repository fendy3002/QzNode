import consoleLog from './consoleLog.js';
import emptyLog from './emptyLog.js';
import prefixLog from './prefixLog.js';
import timedLog from './timedLog.js';
import prefixTimedLog from './prefixTimedLog.js';
import fileLog from './fileLog.js';

var Service = {
    console: consoleLog,
    empty: emptyLog,
    file: fileLog,
    prefix: prefixLog,
    prefixTimed: prefixTimedLog,
    timed: timedLog
};

export default Service;