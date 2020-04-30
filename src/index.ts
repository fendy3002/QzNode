import array = require('./array');
import date = require("./date");
import error = require("./error");
import promise = require("./promise");
import logs = require("./Logs/index");
import io = require("./IO/index");
import requireService = require("./Require");
import queue = require("./Queue/index");
import fileLister = require("./FileLister/index");

import * as types from './types';

let Service = {
    array,
    date,
    error,
    promise,
    
    logs: logs,
    io: io,
    require: requireService,
    queue: queue,
    fileLister: fileLister,
};
export = Service;