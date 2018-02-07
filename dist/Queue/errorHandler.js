'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');
var moment = require('moment');
var momentTz = require('moment');
var openDbConnection = require('./helper/openDbConnection.js');

var errorHandler = function errorHandler(param) {
    var _driver$connection$ta = (0, _extends3.default)({
        driver: "mysql",
        connection: {},
        tableName: "qz_queue",
        runningTableName: "qz_queue_running",
        retry: 0
    }, param),
        driver = _driver$connection$ta.driver,
        connection = _driver$connection$ta.connection,
        tableName = _driver$connection$ta.tableName,
        runningTableName = _driver$connection$ta.runningTableName,
        retry = _driver$connection$ta.retry;

    var usedConnection = (0, _extends3.default)({
        host: "localhost",
        database: "my_database",
        port: "3306",
        user: "root"
    }, connection);

    var insertToQueue = function insertToQueue(db, running, callback) {
        var insertQuery = 'INSERT INTO ' + tableName + ' (\n                tag,\n                utc_run,\n                run_script,\n                params,\n                priority,\n                retry,\n                utc_created)\n            VALUES (?)';
        var insertParam = [running.tag, running.utc_run, running.run_script, running.params, running.priority, running.retry + 1, moment.utc().format("YYYY-MM-DDTHH:mm:ss")];
        var escRunUuid = mysql.escape(running.uuid);
        var deleteQuery = 'DELETE FROM ' + runningTableName + ' WHERE uuid = ' + escRunUuid;
        var dbq = db.query(insertQuery, [insertParam], function (err, results) {
            db.query(deleteQuery, function (err, results) {
                db.end();
                callback({
                    retry: true,
                    code: 0
                });
            });
        });
    };

    var handle = function handle(runUuid, callback) {
        var escRunUuid = mysql.escape(runUuid);
        new Promise(openDbConnection(usedConnection)).then(function (db) {
            var selectQuery = 'SELECT \n                    a.id,\n                    a.uuid,\n                    a.queue_id,\n                    a.tag,\n                    a.utc_run,\n                    a.run_script,\n                    a.params,\n                    a.priority,\n                    a.retry,\n                    a.queue_utc_created,\n                    a.utc_created\n                FROM ' + runningTableName + ' a\n                WHERE a.uuid = ' + escRunUuid;
            db.query(selectQuery, function (err, results) {
                if (err) {
                    db.end();
                    callback({
                        retry: false,
                        code: -1,
                        error: err
                    });
                } else {
                    if (results[0].retry < retry) {
                        insertToQueue(db, results[0], callback);
                    } else {
                        db.end();
                        callback({
                            retry: false,
                            code: 2
                        });
                    }
                }
            });
        });
    };

    return handle;
};

exports.default = errorHandler;