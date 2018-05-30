'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var insertToQueue = function insertToQueue(context) {
    return function (running) {
        return function (resolve, reject) {
            var openDb = context.openDb,
                tableName = context.tableName,
                runningTableName = context.runningTableName;

            var insertQuery = 'INSERT INTO ' + tableName + ' (\n            tag,\n            uuid,\n            `key`,\n            utc_run,\n            run_script,\n            params,\n            priority,\n            retry,\n            utc_created)\n        VALUES (?);';
            var escRunUuid = _mysql2.default.escape(running.uuid);
            var deleteQuery = 'DELETE FROM ' + runningTableName + ' WHERE uuid = ' + escRunUuid + ';';

            var fullQuery = 'SET @last_autocommit = @@autocommit;\n    SET autocommit = 0;\n    LOCK TABLES \n        ' + tableName + ' WRITE,\n        ' + tableName + ' as TR READ,\n        ' + runningTableName + ' WRITE,\n        ' + runningTableName + ' as RW READ;\n    \n    ' + insertQuery + '\n    \n    ' + deleteQuery + '\n    \n    COMMIT;\n    UNLOCK TABLES;\n    SET autocommit = @last_autocommit;';

            var insertParam = [running.tag, running.queue_uuid, running.key, running.utc_run, running.run_script, running.params, running.priority, running.retry, _moment2.default.utc().format("YYYY-MM-DDTHH:mm:ss")];
            openDb().then(function (db) {
                db.getConnection(function (err, connection) {
                    var dbq = connection.query(fullQuery, [insertParam], function (err, results) {
                        connection.release();

                        db.end(function (err) {
                            resolve();
                        });
                    });
                });
            });
        };
    };
};

exports.default = insertToQueue;