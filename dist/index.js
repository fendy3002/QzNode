"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataSet = require('./DataSet');
var promise = require("./Promise/index");
var logs = require("./Logs/index.js");
var io = require("./IO/index.js");
var execService = require("./Exec/index.js");
var uuid = require("./Uuid/index");
var date = require("./Date/index");
var requireService = require("./Require");
var queue = require("./Queue/index.js");
var fileLister = require("./FileLister/index.js");
var time = require("./Time/index.js");
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
exports.default = Service;
