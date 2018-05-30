'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _insertToQueue = require('./insertToQueue.js');

var _insertToQueue2 = _interopRequireDefault(_insertToQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');
var moment = require('moment');
var momentTz = require('moment');


var errorHandler = function errorHandler(_ref) {
    var openDb = _ref.openDb,
        tableName = _ref.tableName,
        runningTableName = _ref.runningTableName,
        retry = _ref.retry,
        log = _ref.log,
        logLevel = _ref.logLevel;

    var handle = function handle(err, job, runUuid) {
        return function (resolve, reject) {
            var handleLogAndResolve = function handleLogAndResolve(retryResult) {
                var resolveResult = {
                    run: false,
                    code: "2",
                    message: "Error",
                    error: err,
                    retry: retryResult
                };
                if (logLevel.error) {
                    var errorMessage = 'ERROR: ' + job.run_script;
                    if (job.key) {
                        errorMessage = 'ERROR: ' + job.run_script + ' with key: ' + job.key;
                    }
                    log.messageln(errorMessage);

                    log.messageln('ERROR_RESULT: ' + JSON.stringify({
                        error: err,
                        retry: retryResult
                    }));
                }
                return resolve(resolveResult);
            };

            var escRunUuid = mysql.escape(runUuid);
            openDb().then(function (db) {
                var insertToQueue = (0, _insertToQueue2.default)({
                    openDb: openDb,
                    tableName: tableName,
                    runningTableName: runningTableName
                });
                var selectQuery = 'SELECT \n                        a.id,\n                        a.uuid,\n                        a.queue_id,\n                        a.queue_uuid,\n                        a.key,\n                        a.tag,\n                        a.utc_run,\n                        a.run_script,\n                        a.params,\n                        a.priority,\n                        a.retry,\n                        a.queue_utc_created,\n                        a.utc_created\n                    FROM ' + runningTableName + ' a\n                    WHERE a.uuid = ' + escRunUuid;

                db.query(selectQuery, function (err, results) {
                    if (err) {
                        db.end(function (err) {
                            handleLogAndResolve({
                                retry: false,
                                code: -1,
                                error: err
                            });
                        });
                    } else {
                        if (results[0].retry < retry) {
                            db.end(function (err) {
                                new Promise(insertToQueue((0, _extends3.default)({}, results[0], {
                                    retry: results[0].retry + 1
                                }))).then(function () {
                                    handleLogAndResolve({
                                        retry: true,
                                        code: 0
                                    });
                                });
                            });
                        } else {
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
        };
    };

    return handle;
};

exports.default = errorHandler;