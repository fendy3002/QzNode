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
var mysql = require('mysql');
var moment = require('moment');
var momentTz = require('moment');
var insertToQueueRaw = require('./insertToQueue');
var errorHandler = function (_a) {
    var openDb = _a.openDb, tableName = _a.tableName, runningTableName = _a.runningTableName, retry = _a.retry, log = _a.log, logLevel = _a.logLevel;
    var handle = function (err, job, runUuid) { return function (resolve, reject) {
        var handleLogAndResolve = function (retryResult) {
            var resolveResult = {
                run: false,
                code: "2",
                message: "Error",
                error: err,
                retry: retryResult
            };
            if (logLevel.error) {
                var errorMessage = "ERROR: " + job.run_script;
                if (job.key) {
                    errorMessage = "ERROR: " + job.run_script + " with key: " + job.key;
                }
                log.messageln(errorMessage);
                log.messageln("ERROR_RESULT: " + JSON.stringify({
                    error: err,
                    retry: retryResult
                }));
            }
            return resolve(resolveResult);
        };
        var escRunUuid = mysql.escape(runUuid);
        openDb()
            .then(function (db) {
            var insertToQueue = insertToQueueRaw({
                openDb: openDb,
                tableName: tableName,
                runningTableName: runningTableName
            });
            var selectQuery = "SELECT \n                        a.id,\n                        a.uuid,\n                        a.queue_id,\n                        a.queue_uuid,\n                        a.key,\n                        a.tag,\n                        a.utc_run,\n                        a.run_script,\n                        a.params,\n                        a.priority,\n                        a.retry,\n                        a.queue_utc_created,\n                        a.utc_created\n                    FROM " + runningTableName + " a\n                    WHERE a.uuid = " + escRunUuid;
            db.query(selectQuery, function (err, results) {
                if (err) {
                    db.end(function (err) {
                        handleLogAndResolve({
                            retry: false,
                            code: -1,
                            error: err
                        });
                    });
                }
                else {
                    if (results[0].retry < retry) {
                        db.end(function (err) {
                            new Promise(insertToQueue(__assign({}, results[0], { retry: results[0].retry + 1 }))).then(function () {
                                handleLogAndResolve({
                                    retry: true,
                                    code: 0
                                });
                            });
                        });
                    }
                    else {
                        db.end(function (err) {
                            handleLogAndResolve({
                                retry: false,
                                code: 2
                            });
                        });
                    }
                }
            });
        });
    }; };
    return handle;
};
module.exports = errorHandler;
