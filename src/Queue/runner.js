import { setInterval } from 'timers';
import mysql from 'mysql';
import moment from 'moment';
import { runInContext } from 'vm';

import openDbConnection from './helper/openDbConnection.js';
import uuid from '../Uuid/index.js';
import emptyLog from '../Logs/emptyLog.js';
import queueRetrieve from './runner/queueRetrieve.js';
import errorHandlerRaw from './runner/errorHandler.js';
import jobCountManagerRaw from './runner/jobCountManager.js';
import jobRunManagerRaw from './runner/jobRunManager.js';

let runner = (param = {}) => {
    let {
        driver,
        connection,
        tableName,
        runningTableName,
        failedTableName,
        tag,
        retry,
        log,
        logLevel,
        workerLimit
    } = {
        ...{
            driver: "mysql",
            connection: {},
            tableName: "qz_queue",
            runningTableName: "qz_queue_running",
            failedTableName: "qz_queue_failed",
            tag: "default",
            retry: 0,
            log: emptyLog(),
            workerLimit: {},
            logLevel: {}
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
    logLevel = {
        start: false,
        error: true,
        done: true,
        scriptNotFound: true,
        workerLimit: false,
        noJob: false,

        ...logLevel
    };

    let context = {
        openDb: () => {
            return new Promise(openDbConnection(usedConnection));
        },
        tableName: tableName,
        runningTableName: runningTableName,
        tag: tag,
        retry: retry,
        log: log,
        logLevel: logLevel,
        workerLimit: workerLimit
    };

    let errorHandler = errorHandlerRaw({
        openDb: context.openDb,
        tableName: tableName,
        runningTableName: runningTableName,
        retry: retry,
        log: log,
        logLevel, logLevel
    });
    let jobCountManager = jobCountManagerRaw({workerLimit});
    let jobRunManager = jobRunManagerRaw(context, jobCountManager, errorHandler);
    
    let once = () => {
        let jobUuid = uuid();
        return new Promise(queueRetrieve(context)(jobUuid))
            .then((selectStatement) => {
                if(selectStatement && selectStatement.length > 0){
                    let job = {
                        ...selectStatement[0],
                        uuid: jobUuid
                    };
                    return new Promise(jobRunManager(jobUuid, job));
                }
                else{
                    if(logLevel.noJob){
                        log.messageln(`WORKER LIMIT: ${job.run_script}`);
                    }
                    return Promise.resolve({
                        run: false,
                        code: "1",
                        message: "No Job"
                    });
                }
            });
        };

    let listen = ({ interval = 5000 }) => {
        once();
        setInterval(once, interval);
    };

    return {
        once,
        listen
    }
};

export default runner;