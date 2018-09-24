export {};

let dataSet = require('./DataSet');
let promise = require("./Promise/index");
let logs = require("./Logs/index.js");
let io = require("./IO/index.js");
let execService = require("./Exec/index.js");
let uuid = require("./Uuid/index");
let date = require("./Date/index");
let requireService = require("./Require");
let queue = require("./Queue/index.js");
let fileLister = require("./FileLister/index");
let time = require("./Time/index.js");

let Service = function() {
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