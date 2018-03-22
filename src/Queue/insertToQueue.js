let insertToQueue = ({
    db}) => (running, callback) => {
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

export default insertToQueue;