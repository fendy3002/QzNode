let dataSet = require('./DataSet');
let promise = require("./Promise/index");
let logs = require("./Logs/index");
let io = require("./IO/index");
let execService = require("./Exec/index");
let uuid = require("./Uuid/index");
let date = require("./Date/index");
let requireService = require("./Require");
let queue = require("./Queue/index");
let fileLister = require("./FileLister/index");
let time = require("./Time/index");

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