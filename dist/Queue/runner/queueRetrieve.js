'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queueRetrieve = function queueRetrieve(_ref) {
    var db = _ref.db,
        tableName = _ref.tableName,
        runningTableName = _ref.runningTableName,
        tag = _ref.tag,
        log = _ref.log,
        logLevel = _ref.logLevel,
        retry = _ref.retry;
    return function (jobUuid) {
        return function (resolve, reject) {
            var escTableName = tableName;
            var escRunningTableName = runningTableName;
            var escTag = _mysql2.default.escape(tag);
            var escRetry = _mysql2.default.escape(retry);

            var selectQuery = 'START TRANSACTION;\n    INSERT INTO ' + escRunningTableName + '(\n        queue_id,\n        queue_uuid,\n        `key`,\n        uuid,\n        tag,\n        utc_run,\n        run_script,\n        params,\n        priority,\n        retry,\n        queue_utc_created,\n        utc_created\n    )\n    SELECT \n        TR.id,\n        TR.uuid,\n        TR.`key`,\n        \'' + jobUuid + '\',\n        TR.tag,\n        TR.utc_run,\n        TR.run_script,\n        TR.params,\n        TR.priority,\n        TR.retry,\n        TR.utc_created,\n        UTC_TIMESTAMP()\n    FROM ' + escTableName + ' TR \n    WHERE TR.tag = ' + escTag + '\n        AND TR.retry <= ' + escRetry + '\n        AND TR.utc_run <= UTC_TIMESTAMP()\n    ORDER BY TR.priority desc,\n        TR.utc_created asc\n    LIMIT 1;\n    \n    DELETE TW \n    FROM ' + escTableName + ' TW\n        INNER JOIN ' + escRunningTableName + ' RW\n            ON TW.id = RW.queue_id\n    WHERE RW.uuid = \'' + jobUuid + '\';\n\n    SELECT \n        queue_id,\n        queue_uuid,\n        `key`,\n        tag,\n        utc_run,\n        run_script,\n        params,\n        priority,\n        retry,\n        queue_utc_created,\n        utc_created\n    FROM ' + escRunningTableName + ' RR\n    WHERE RR.uuid = \'' + jobUuid + '\';\n    \n    COMMIT;';
            db.getConnection(function (err, connection) {
                connection.query(selectQuery, function (err, results) {
                    connection.release();
                    if (err) {
                        if (logLevel.error) {
                            log.messageln('ERROR 2173: ' + JSON.stringify(err));
                        }
                    }
                    var selectStatement = results[3];
                    resolve(selectStatement);
                });
            });
        };
    };
};

exports.default = queueRetrieve;