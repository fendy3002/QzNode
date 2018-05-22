import moment from 'moment';
import mysql from 'mysql';

let insertToQueue = ({
    db,
    tableName,
    runningTableName
}) => (running) => (resolve, reject) => {
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
        VALUES (?)`;
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
    let escRunUuid = mysql.escape(running.uuid);
    let deleteQuery = `DELETE FROM ${runningTableName} WHERE uuid = ${escRunUuid}`;
    db.getConnection((err, connection) => {
        let dbq = connection.query(insertQuery, [insertParam], (err, results) => {
            connection.query(deleteQuery, (err, results) => {
                connection.release();
                resolve();
            });
        });
    });
};

export default insertToQueue;