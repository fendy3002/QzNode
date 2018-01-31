import { setInterval } from 'timers';

let mysql = require('mysql');
let moment = require('moment');
let openDbConnection = require('./helper/openDbConnection.js');

let runner = (param = {}) => {
    let {
        driver,
        connection,
        tableName,
        runningTableName,
        failedTableName,
        tag,
        retry
    } = {
        ...{
            driver: "mysql",
            connection: {},
            tableName: "qz_queue",
            runningTableName: "qz_queue_running",
            failedTableName: "qz_queue_failed",
            tag: "default",
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
        ...connection,
    };

    let once = () => {
        let escTableName = tableName;
        let escRunningTableName = runningTableName;
        let escTag = mysql.escape(tag);
        let escRetry = mysql.escape(retry);
        //let utcNow = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
        let selectQuery = `LOCK TABLES ${escTableName} AS TR READ, 
                ${escTableName} AS TW WRITE, 
                ${escRunningTableName} AS RR READ,
                ${escRunningTableName} AS RW WRITE;
            INSERT INTO RW{
                queue_id,
                tag,
                utc_run,
                run_script,
                params,
                priority,
                retry,
                queue_utc_created,
                utc_created
            }
            SELECT 
                TR.id,
                TR.tag,
                TR.utc_run,
                TR.run_script,
                TR.params,
                TR.priority,
                TR.retry,
                TR.utc_created,
                UTC_TIMESTAMP()
            FROM TR 
            WHERE TR.tag = '${escTag}' 
                AND TR.retry <= ${escRetry}
                AND TR.utc_run <= UTC_TIMESTAMP()
            ORDER BY TR.priority desc,
                TR.utc_created asc;
            
            DELETE TW 
            FROM TW
                INNER JOIN RW
                    ON TW.id = RW.queue_id;

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
            FROM RR;

            UNLOCK TABLES;`;

        return new Promise(openDbConnection(usedConnection)).then((db) => {
            db.query(selectQuery, (err, results) => {
                let selectStatement = results[3];
                if(selectStatement){
                    let job = selectStatement[0];
                    console.log(job);
                }
            });
        });
    };
    let listen = ({ interval = 1000 }) => {
        setInterval(once, interval);
    };

    return {
        once,
        listen
    }
};

export default runner;