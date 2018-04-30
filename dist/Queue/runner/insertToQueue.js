'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var insertToQueue = function insertToQueue(_ref) {
    var db = _ref.db,
        tableName = _ref.tableName,
        runningTableName = _ref.runningTableName;
    return function (running) {
        return function (resolve, reject) {
            var insertQuery = 'INSERT INTO ' + tableName + ' (\n            tag,\n            utc_run,\n            run_script,\n            params,\n            priority,\n            retry,\n            utc_created)\n        VALUES (?)';
            var insertParam = [running.tag, running.utc_run, running.run_script, running.params, running.priority, running.retry, _moment2.default.utc().format("YYYY-MM-DDTHH:mm:ss")];
            var escRunUuid = _mysql2.default.escape(running.uuid);
            var deleteQuery = 'DELETE FROM ' + runningTableName + ' WHERE uuid = ' + escRunUuid;
            db.getConnection(function (err, connection) {
                var dbq = connection.query(insertQuery, [insertParam], function (err, results) {
                    connection.query(deleteQuery, function (err, results) {
                        connection.release();
                        resolve();
                    });
                });
            });
        };
    };
};

exports.default = insertToQueue;