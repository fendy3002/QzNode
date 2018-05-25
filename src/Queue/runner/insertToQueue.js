import moment from 'moment';
import mysql from 'mysql';

let insertToQueue = (context) => (running) => (resolve, reject) => {
    let {
        openDb,
        tableName,
        runningTableName
    } = context;
    let insertQuery = `INSERT INTO ${tableName} (
            tag,
            uuid,
            \`key\`,
            utc_run,
            run_script,
            params,
            priority,
            retry,
            utc_created)
        VALUES (?);`;
    let escRunUuid = mysql.escape(running.uuid);
    let deleteQuery = `DELETE FROM ${runningTableName} WHERE uuid = ${escRunUuid};`;

    let fullQuery = `SET @last_autocommit = @@autocommit;
    SET autocommit = 0;
    LOCK TABLES 
        ${tableName} WRITE,
        ${tableName} as TR READ,
        ${runningTableName} WRITE,
        ${runningTableName} as RW READ;
    
    ${insertQuery}
    
    ${deleteQuery}
    
    COMMIT;
    UNLOCK TABLES;
    SET autocommit = @last_autocommit;`;
    
    let insertParam = [
        running.tag,
        running.queue_uuid,
        running.key,
        running.utc_run,
        running.run_script,
        running.params,
        running.priority,
        running.retry,
        moment.utc().format("YYYY-MM-DDTHH:mm:ss")
    ];
    openDb().then((db) => {
        db.getConnection((err, connection) => {
            let dbq = connection.query(fullQuery, [insertParam], (err, results) => {
                connection.release();

                db.end((err) => {
                    resolve();
                });
            });
        });
    })
};

export default insertToQueue;