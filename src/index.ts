let dataSet = require('./DataSet');
import promise from "./Promise/index.js";
import logs from "./Logs/index.js";
import io from "./IO/index.js";
import execService from "./Exec/index.js";
let uuid = require("./Uuid/index");
import date from "./Date/index.js";
let requireService = require("./Require");
import queue from "./Queue/index.js";
import fileLister from "./FileLister/index.js";
import time from "./Time/index.js";

var Service = function() {
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

export default Service;