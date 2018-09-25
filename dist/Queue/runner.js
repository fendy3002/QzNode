"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var setInterval = require('timers').setInterval;
var mysql = require('mysql');
var moment = require('moment');
var runInContext = require('vm').runInContext;
var openDbConnection = require('./helper/openDbConnection');
var uuid = require('../Uuid/index');
var emptyLog = require('../Logs/emptyLog');
var queueRetrieve = require('./runner/queueRetrieve');
var errorHandlerRaw = require('./runner/errorHandler');
var jobCountManagerRaw = require('./runner/jobCountManager');
var jobRunManagerRaw = require('./runner/jobRunManager');
;
var runner = function (param) {
    var _a = __assign({
        driver: "mysql",
        tableName: "qz_queue",
        runningTableName: "qz_queue_running",
        failedTableName: "qz_queue_failed",
        tag: "default",
        retry: 0,
        log: emptyLog(),
        workerLimit: {}
    }, param), driver = _a.driver, tableName = _a.tableName, runningTableName = _a.runningTableName, failedTableName = _a.failedTableName, tag = _a.tag, retry = _a.retry, log = _a.log, workerLimit = _a.workerLimit;
    var logLevel = __assign({ start: false, error: true, done: true, scriptNotFound: true, workerLimit: false, noJob: false }, param.logLevel);
    var connection = __assign({
        host: "localhost",
        database: "my_database",
        port: "3306",
        user: "root"
    }, param.connection);
    var context = {
        openDb: function () {
            return new Promise(openDbConnection(connection));
        },
        tableName: tableName,
        runningTableName: runningTableName,
        tag: tag,
        retry: retry,
        log: log,
        logLevel: logLevel,
        workerLimit: workerLimit
    };
    var errorHandler = errorHandlerRaw({
        openDb: context.openDb,
        tableName: tableName,
        runningTableName: runningTableName,
        retry: retry,
        log: log,
        logLevel: logLevel
    });
    var jobCountManager = jobCountManagerRaw({ workerLimit: workerLimit });
    var jobRunManager = jobRunManagerRaw(context, jobCountManager, errorHandler);
    var once = function () {
        var jobUuid = uuid();
        return new Promise(queueRetrieve(context)(jobUuid))
            .then(function (selectStatement) {
            if (selectStatement && selectStatement.length > 0) {
                var job = __assign({}, selectStatement[0], { uuid: jobUuid });
                return new Promise(jobRunManager(jobUuid, job));
            }
            else {
                if (logLevel.noJob) {
                    log.messageln("NO JOB");
                }
                return Promise.resolve({
                    run: false,
                    code: "1",
                    message: "No Job"
                });
            }
        });
    };
    var listen = function (_a) {
        var _b = _a.interval, interval = _b === void 0 ? 5000 : _b;
        once();
        setInterval(once, interval);
    };
    return {
        once: once,
        listen: listen
    };
};
module.exports = runner;
