let mysql = require('mysql');

let queueRetrieve = ({
    openDb,
    tableName,
    runningTableName,
    tag,
    log,
    logLevel,
    retry
}) => (jobUuid) => (resolve, reject) => {
    let escTableName = tableName;
    let escRunningTableName = runningTableName;
    let escTag = mysql.escape(tag);
    let escRetry = mysql.escape(retry);

    let selectQuery = `SET @last_autocommit = @@autocommit;
    SET autocommit = 0;
    LOCK TABLES 
        ${tableName} WRITE,
        ${tableName} as TR READ,
        ${escRunningTableName} WRITE,
        ${escRunningTableName} as RW READ;

    INSERT INTO ${escRunningTableName}(
        queue_id,
        queue_uuid,
        \`key\`,
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
        TR.uuid,
        TR.\`key\`,
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
    
    DELETE ${escTableName}
    FROM ${escTableName}
        INNER JOIN ${escRunningTableName} RW
            ON ${escTableName}.id = RW.queue_id
    WHERE RW.uuid = '${jobUuid}';

    SELECT 
        queue_id,
        queue_uuid,
        \`key\`,
        tag,
        utc_run,
        run_script,
        params,
        priority,
        retry,
        queue_utc_created,
        utc_created
    FROM ${escRunningTableName} RW
    WHERE RW.uuid = '${jobUuid}';
    
    COMMIT;
    UNLOCK TABLES;
    SET autocommit = @last_autocommit;`;

    openDb().then((db) => {
        db.getConnection((err, connection) => {
            connection.query(selectQuery, (err, results) => {
                connection.release();
                if(err){
                    if(logLevel.error){
                        log.messageln(`ERROR 2173: ` + JSON.stringify(err));
                    }
                }
                let selectStatement = results[5];
                db.end((err) => {
                    resolve(selectStatement);
                });
            });
        });
    });
};

module.exports = queueRetrieve;