import array = require('./array');
import promise = require("./Promise/index");
import logs = require("./Logs/index");
import io = require("./IO/index");
import date = require("./date/index");
import requireService = require("./Require");
import queue = require("./Queue/index");
import fileLister = require("./FileLister/index");
import time = require("./Time/index");

import * as types from './types';

let Service = {
    array,
    promise: promise,
    logs: logs,
    date: date,
    io: io,
    require: requireService,
    queue: queue,
    fileLister: fileLister,
    time: time
};
export = Service;