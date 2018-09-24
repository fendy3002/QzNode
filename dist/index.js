"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataSet = require('./DataSet');
var index_js_1 = require("./Promise/index.js");
var index_js_2 = require("./Logs/index.js");
var index_js_3 = require("./IO/index.js");
var index_js_4 = require("./Exec/index.js");
var uuid = require("./Uuid/index");
var index_js_5 = require("./Date/index.js");
var requireService = require("./Require");
var index_js_6 = require("./Queue/index.js");
var index_js_7 = require("./FileLister/index.js");
var index_js_8 = require("./Time/index.js");
var Service = function () {
    return {
        dataSet: dataSet,
        exec: index_js_4.default,
        promise: index_js_1.default,
        logs: index_js_2.default,
        date: index_js_5.default,
        io: index_js_3.default,
        uuid: uuid,
        require: requireService,
        queue: index_js_6.default,
        fileLister: index_js_7.default,
        time: index_js_8.default
    };
};
exports.default = Service;
