let mysql = require('mysql');
let moment = require('moment');
let momentTz = require('moment');
import openDbConnection from './helper/openDbConnection.js';
import insertToQueueRaw from './runner/insertToQueue.js';

let errorHandler = ({
    driver,
    connection,
    tableName,
    runningTableName,
    retry
}) => {
    let handle = (runUuid) => (resolve, reject) => {
        let escRunUuid = mysql.escape(runUuid);
        new Promise(openDbConnection(connection))
            .then((db) => {
                let insertToQueue = insertToQueueRaw({
                    db,
                    tableName,
                    runningTableName
                });
                let selectQuery = `SELECT 
                        a.id,
                        a.uuid,
                        a.queue_id,
                        a.queue_uuid,
                        a.key,
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
                        resolve({
                            retry: false,
                            code: -1,
                            error: err
                        });
                    }
                    else{
                        if(results[0].retry < retry){
                            new Promise(insertToQueue({
                                    ...results[0],
                                    retry: results[0].retry + 1
                                })).then(() => {
                                    db.end((err) => {
                                        resolve({
                                            retry: true,
                                            code: 0
                                        });
                                    });
                                });
                        }
                        else{
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

    return handle;
};

export default errorHandler;