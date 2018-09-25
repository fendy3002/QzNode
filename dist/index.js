"use strict";
var dataSet = require('./DataSet');
var promise = require("./Promise/index");
var logs = require("./Logs/index");
var io = require("./IO/index");
var execService = require("./Exec/index");
var uuid = require("./Uuid/index");
var date = require("./Date/index");
var requireService = require("./Require");
var queue = require("./Queue/index");
var fileLister = require("./FileLister/index");
var time = require("./Time/index");
;
var Service = function () {
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
module.exports = Service;
