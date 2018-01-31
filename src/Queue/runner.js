import { setInterval } from 'timers';
import uuid from '../Uuid/index.js';

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

        let jobUuid = uuid();
        //let utcNow = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
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

        return new Promise(openDbConnection(usedConnection)).then((db) => {
            return new Promise((resolve, reject) => {
                let q = db.query(selectQuery, (err, results) => {
                    console.log(results);
                    let selectStatement = results[3];
                    if(selectStatement){
                        let job = selectStatement[0];
                        let scriptToRun = require(job.run_script);
                        resolve(scriptToRun(JSON.parse(job.params)));
                    }
                    else{
                        console.log("no job");
                    }
                });
                console.log(q.sql);
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