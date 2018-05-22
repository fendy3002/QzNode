'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _openDbConnection = require('./helper/openDbConnection.js');

var _openDbConnection2 = _interopRequireDefault(_openDbConnection);

var _insertToQueue = require('./runner/insertToQueue.js');

var _insertToQueue2 = _interopRequireDefault(_insertToQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');
var moment = require('moment');
var momentTz = require('moment');


var errorHandler = function errorHandler(_ref) {
    var driver = _ref.driver,
        connection = _ref.connection,
        tableName = _ref.tableName,
        runningTableName = _ref.runningTableName,
        retry = _ref.retry;

    var handle = function handle(runUuid) {
        return function (resolve, reject) {
            var escRunUuid = mysql.escape(runUuid);
            new Promise((0, _openDbConnection2.default)(connection)).then(function (db) {
                var insertToQueue = (0, _insertToQueue2.default)({
                    db: db,
                    tableName: tableName,
                    runningTableName: runningTableName
                });
                var selectQuery = 'SELECT \n                        a.id,\n                        a.uuid,\n                        a.queue_id,\n                        a.queue_uuid,\n                        a.key,\n                        a.tag,\n                        a.utc_run,\n                        a.run_script,\n                        a.params,\n                        a.priority,\n                        a.retry,\n                        a.queue_utc_created,\n                        a.utc_created\n                    FROM ' + runningTableName + ' a\n                    WHERE a.uuid = ' + escRunUuid;
                db.query(selectQuery, function (err, results) {
                    if (err) {
                        db.end();
                        resolve({
                            retry: false,
                            code: -1,
                            error: err
                        });
                    } else {
                        if (results[0].retry < retry) {
                            new Promise(insertToQueue((0, _extends3.default)({}, results[0], {
                                retry: results[0].retry + 1
                            }))).then(function () {
                                db.end(function (err) {
                                    resolve({
                                        retry: true,
                                        code: 0
                                    });
                                });
                            });
                        } else {
                            db.end();
                            resolve({
                                retry: false,
                                code: 2
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