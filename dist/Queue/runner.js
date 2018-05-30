'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _timers = require('timers');

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _vm = require('vm');

var _openDbConnection = require('./helper/openDbConnection.js');

var _openDbConnection2 = _interopRequireDefault(_openDbConnection);

var _index = require('../Uuid/index.js');

var _index2 = _interopRequireDefault(_index);

var _emptyLog = require('../Logs/emptyLog.js');

var _emptyLog2 = _interopRequireDefault(_emptyLog);

var _queueRetrieve = require('./runner/queueRetrieve.js');

var _queueRetrieve2 = _interopRequireDefault(_queueRetrieve);

var _errorHandler = require('./runner/errorHandler.js');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _jobCountManager = require('./runner/jobCountManager.js');

var _jobCountManager2 = _interopRequireDefault(_jobCountManager);

var _jobRunManager = require('./runner/jobRunManager.js');

var _jobRunManager2 = _interopRequireDefault(_jobRunManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runner = function runner() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _driver$connection$ta = (0, _extends3.default)({
        driver: "mysql",
        connection: {},
        tableName: "qz_queue",
        runningTableName: "qz_queue_running",
        failedTableName: "qz_queue_failed",
        tag: "default",
        retry: 0,
        log: (0, _emptyLog2.default)(),
        workerLimit: {},
        logLevel: {}
    }, param),
        driver = _driver$connection$ta.driver,
        connection = _driver$connection$ta.connection,
        tableName = _driver$connection$ta.tableName,
        runningTableName = _driver$connection$ta.runningTableName,
        failedTableName = _driver$connection$ta.failedTableName,
        tag = _driver$connection$ta.tag,
        retry = _driver$connection$ta.retry,
        log = _driver$connection$ta.log,
        logLevel = _driver$connection$ta.logLevel,
        workerLimit = _driver$connection$ta.workerLimit;

    var usedConnection = (0, _extends3.default)({
        host: "localhost",
        database: "my_database",
        port: "3306",
        user: "root"
    }, connection);
    logLevel = (0, _extends3.default)({
        start: false,
        error: true,
        done: true,
        scriptNotFound: true,
        workerLimit: false,
        noJob: false

    }, logLevel);

    var context = {
        openDb: function openDb() {
            return new Promise((0, _openDbConnection2.default)(usedConnection));
        },
        tableName: tableName,
        runningTableName: runningTableName,
        tag: tag,
        retry: retry,
        log: log,
        logLevel: logLevel,
        workerLimit: workerLimit
    };

    var errorHandler = (0, _errorHandler2.default)((0, _defineProperty3.default)({
        openDb: context.openDb,
        tableName: tableName,
        runningTableName: runningTableName,
        retry: retry,
        log: log,
        logLevel: logLevel }, 'logLevel', logLevel));
    var jobCountManager = (0, _jobCountManager2.default)({ workerLimit: workerLimit });
    var jobRunManager = (0, _jobRunManager2.default)(context, jobCountManager, errorHandler);

    var once = function once() {
        var jobUuid = (0, _index2.default)();
        return new Promise((0, _queueRetrieve2.default)(context)(jobUuid)).then(function (selectStatement) {
            if (selectStatement && selectStatement.length > 0) {
                var _job = (0, _extends3.default)({}, selectStatement[0], {
                    uuid: jobUuid
                });
                return new Promise(jobRunManager(jobUuid, _job));
            } else {
                if (logLevel.noJob) {
                    log.messageln('WORKER LIMIT: ' + job.run_script);
                }
                return Promise.resolve({
                    run: false,
                    code: "1",
                    message: "No Job"
                });
            }
        });
    };

    var listen = function listen(_ref) {
        var _ref$interval = _ref.interval,
            interval = _ref$interval === undefined ? 5000 : _ref$interval;

        once();
        (0, _timers.setInterval)(once, interval);
    };

    return {
        once: once,
        listen: listen
    };
};

exports.default = runner;