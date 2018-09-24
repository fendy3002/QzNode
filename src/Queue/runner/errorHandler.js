let mysql = require('mysql');
let moment = require('moment');
let momentTz = require('moment');
let insertToQueueRaw = require('./insertToQueue.js');

let errorHandler = ({
    openDb,
    tableName,
    runningTableName,
    retry,
    log,
    logLevel
}) => {
    let handle = (err, job, runUuid) => (resolve, reject) => {
        let handleLogAndResolve = (retryResult) => {
            let resolveResult = {
                run: false,
                code: "2",
                message: "Error",
                error: err,
                retry: retryResult
            };
            if(logLevel.error){
                let errorMessage = `ERROR: ${job.run_script}`;
                if(job.key){
                    errorMessage = `ERROR: ${job.run_script} with key: ${job.key}`;
                }
                log.messageln(errorMessage);

                log.messageln(`ERROR_RESULT: ` + JSON.stringify({
                    error: err,
                    retry: retryResult
                }));
            }
            return resolve(resolveResult);
        };

        let escRunUuid = mysql.escape(runUuid);
        openDb()
            .then((db) => {
                let insertToQueue = insertToQueueRaw({
                    openDb,
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
                        db.end((err) => {
                            handleLogAndResolve({
                                retry: false,
                                code: -1,
                                error: err
                            });
                        });
                    }
                    else{
                        if(results[0].retry < retry){
                            db.end((err) => {
                                new Promise(insertToQueue({
                                    ...results[0],
                                    retry: results[0].retry + 1
                                })).then(() => {
                                    handleLogAndResolve({
                                        retry: true,
                                        code: 0
                                    });
                                });
                            });
                        }
                        else{
                            db.end((err) => {
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

    return handle;
};

module.exports = errorHandler;