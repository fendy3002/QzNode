import dataSet = require('./DataSet');
import promise = require("./Promise/index");
import logs = require("./Logs/index");
import io = require("./IO/index");
import execService = require("./Exec/index");
import uuid = require("./Uuid/index");
import date = require("./Date/index");
import requireService = require("./Require");
import queue = require("./Queue/index");
import fileLister = require("./FileLister/index");
import time = require("./Time/index");

interface QzService {
    dataSet: any;
    exec: any;
    promise: any;
    logs: any;
    date: any;
    io: any;
    uuid: any;
    require: any;
    queue: any;
    fileLister: any;
    time: any;
};

let Service = function() : QzService {
    return {
        dataSet: dataSet,
        exec: execService,
        promise: promise,
        logs: logs,
        date: date,
        io: io,
        uuid: uuid,
        require: requireService,
        queue: queue,
        fileLister: fileLister,
        time: time
    };
};
export = Service;