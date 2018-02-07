let mysql = require('mysql');
let moment = require('moment');
let momentTz = require('moment');
let openDbConnection = require('./helper/openDbConnection.js');

let errorHandler = (param) => {
    let {driver,
        connection,
        tableName,
        runningTableName,
        retry} = {
            ...{
                driver: "mysql",
                connection: {},
                tableName: "qz_queue",
                runningTableName: "qz_queue_running",
                retry: 0
            },
            ...param
        };
    let usedConnection = {
        ...{
            host: "localhost",
            database: "my_database",
            port: "3306",
            user: "root"
        },
        ...connection
    };

    let insertToQueue = (db, running, callback) => {
        let insertQuery = `INSERT INTO ${tableName} (
                tag,
                utc_run,
                run_script,
                params,
                priority,
                retry,
                utc_created)
            VALUES (?)`;
        let insertParam = [
            running.tag,
            running.utc_run,
            running.run_script,
            running.params,
            running.priority,
            running.retry + 1,
            moment.utc().format("YYYY-MM-DDTHH:mm:ss")
        ];
        let escRunUuid = mysql.escape(running.uuid);
        let deleteQuery = `DELETE FROM ${runningTableName} WHERE uuid = ${escRunUuid}`;
        let dbq = db.query(insertQuery, [insertParam], (err, results) => {
            db.query(deleteQuery, (err, results) => {
                db.end();
                callback({
                    retry: true,
                    code: 0
                });
            });
        });
    };

    let handle = (runUuid, callback) => {
        let escRunUuid = mysql.escape(runUuid);
        new Promise(openDbConnection(usedConnection)).then((db) => {
            let selectQuery = `SELECT 
                    a.id,
                    a.uuid,
                    a.queue_id,
                    a.tag,
                    a.utc_run,
                    a.run_script,
                    a.params,
                    a.priority,
                    a.retry,
                    a.queue_utc_created,
                    a.utc_created
                FROM ${runningTableName} a
                WHERE a.uuid = ${escRunUuid}`;
            db.query(selectQuery, (err, results) => {
                if(err){
                    db.end();
                    callback({
                        retry: false,
                        code: -1,
                        error: err
                    });
                }
                else{
                    if(results[0].retry < retry){
                        insertToQueue(db, results[0], callback);
                    }
                    else{
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

export default errorHandler;