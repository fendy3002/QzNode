import array = require('./array');
import date = require("./date");
import error = require("./error");
import retryable = require("./retryable");
import promise = require("./Promise/index");
import logs = require("./Logs/index");
import io = require("./IO/index");
import requireService = require("./Require");
import queue = require("./Queue/index");
import fileLister = require("./FileLister/index");
import time = require("./Time/index");

import * as types from './types';

let Service = {
    array,
    date,
    error,
    retryable,
    
    promise: promise,
    logs: logs,
    io: io,
    require: requireService,
    queue: queue,
    fileLister: fileLister,
    time: time
};
export = Service;