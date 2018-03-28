import mysql from 'mysql';

let queueRetrieve = ({
    db,
    tableName,
    runningTableName,
    tag,
    log,
    retry
}) => (jobUuid) => (resolve, reject) => {
    let escTableName = tableName;
    let escRunningTableName = runningTableName;
    let escTag = mysql.escape(tag);
    let escRetry = mysql.escape(retry);

    let selectQuery = `START TRANSACTION;
    INSERT INTO ${escRunningTableName}(
        queue_id,
        uuid,
        tag,
        utc_run,
        run_script,
        params,
        priority,
        retry,
        queue_utc_created,
        utc_created
    )
    SELECT 
        TR.id,
        '${jobUuid}',
        TR.tag,
        TR.utc_run,
        TR.run_script,
        TR.params,
        TR.priority,
        TR.retry,
        TR.utc_created,
        UTC_TIMESTAMP()
    FROM ${escTableName} TR 
    WHERE TR.tag = ${escTag}
        AND TR.retry <= ${escRetry}
        AND TR.utc_run <= UTC_TIMESTAMP()
    ORDER BY TR.priority desc,
        TR.utc_created asc
    LIMIT 1;
    
    DELETE TW 
    FROM ${escTableName} TW
        INNER JOIN ${escRunningTableName} RW
            ON TW.id = RW.queue_id
    WHERE RW.uuid = '${jobUuid}';

    SELECT 
        queue_id,
        tag,
        utc_run,
        run_script,
        params,
        priority,
        retry,
        queue_utc_created,
        utc_created
    FROM ${escRunningTableName} RR
    WHERE RR.uuid = '${jobUuid}';
    
    COMMIT;`;
    db.getConnection((err, connection) => {
        connection.query(selectQuery, (err, results) => {
            connection.destroy();
            if(err){
                if(logLevel.error){
                    log.messageln(`ERROR 2173: ` + JSON.stringify(err));
                }
            }
            let selectStatement = results[3];
            resolve(selectStatement);
        });
    });
};

export default queueRetrieve;