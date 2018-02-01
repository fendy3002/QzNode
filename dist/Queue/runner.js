'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _timers = require('timers');

var _index = require('../Uuid/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');
var moment = require('moment');
var openDbConnection = require('./helper/openDbConnection.js');

var runner = function runner() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _driver$connection$ta = (0, _extends3.default)({
        driver: "mysql",
        connection: {},
        tableName: "qz_queue",
        runningTableName: "qz_queue_running",
        failedTableName: "qz_queue_failed",
        tag: "default",
        retry: 0
    }, param),
        driver = _driver$connection$ta.driver,
        connection = _driver$connection$ta.connection,
        tableName = _driver$connection$ta.tableName,
        runningTableName = _driver$connection$ta.runningTableName,
        failedTableName = _driver$connection$ta.failedTableName,
        tag = _driver$connection$ta.tag,
        retry = _driver$connection$ta.retry;

    var usedConnection = (0, _extends3.default)({
        host: "localhost",
        database: "my_database",
        port: "3306",
        user: "root"
    }, connection);

    var once = function once() {
        var escTableName = tableName;
        var escRunningTableName = runningTableName;
        var escTag = mysql.escape(tag);
        var escRetry = mysql.escape(retry);

        var jobUuid = (0, _index2.default)();
        //let utcNow = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
        var selectQuery = 'START TRANSACTION;\n            INSERT INTO ' + escRunningTableName + '(\n                queue_id,\n                uuid,\n                tag,\n                utc_run,\n                run_script,\n                params,\n                priority,\n                retry,\n                queue_utc_created,\n                utc_created\n            )\n            SELECT \n                TR.id,\n                \'' + jobUuid + '\',\n                TR.tag,\n                TR.utc_run,\n                TR.run_script,\n                TR.params,\n                TR.priority,\n                TR.retry,\n                TR.utc_created,\n                UTC_TIMESTAMP()\n            FROM ' + escTableName + ' TR \n            WHERE TR.tag = ' + escTag + '\n                AND TR.retry <= ' + escRetry + '\n                AND TR.utc_run <= UTC_TIMESTAMP()\n            ORDER BY TR.priority desc,\n                TR.utc_created asc\n            LIMIT 1;\n            \n            DELETE TW \n            FROM ' + escTableName + ' TW\n                INNER JOIN ' + escRunningTableName + ' RW\n                    ON TW.id = RW.queue_id\n            WHERE RW.uuid = \'' + jobUuid + '\';\n\n            SELECT \n                queue_id,\n                tag,\n                utc_run,\n                run_script,\n                params,\n                priority,\n                retry,\n                queue_utc_created,\n                utc_created\n            FROM ' + escRunningTableName + ' RR\n            WHERE RR.uuid = \'' + jobUuid + '\';\n\n            COMMIT;';

        return new Promise(openDbConnection(usedConnection)).then(function (db) {
            return new Promise(function (resolve, reject) {
                var q = db.query(selectQuery, function (err, results) {
                    console.log(results);
                    var selectStatement = results[3];
                    if (selectStatement) {
                        var job = selectStatement[0];
                        var scriptToRun = require(job.run_script);
                        var runResult = scriptToRun(JSON.parse(job.params));
                        db.end();
                        resolve(runResult);
                    } else {
                        console.log("no job");
                    }
                });
                console.log(q.sql);
            });
        });
    };
    var listen = function listen(_ref) {
        var _ref$interval = _ref.interval,
            interval = _ref$interval === undefined ? 1000 : _ref$interval;

        (0, _timers.setInterval)(once, interval);
    };

    return {
        once: once,
        listen: listen
    };
};

exports.default = runner;