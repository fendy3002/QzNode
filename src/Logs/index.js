import consoleLog from './consoleLog.js';
import emptyLog from './emptyLog.js';
import fileLog from './fileLog.js';

var Service = {
    console: consoleLog,
    empty: emptyLog,
    file: fileLog
};

export default Service;