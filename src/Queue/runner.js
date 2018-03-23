import { setInterval } from 'timers';
import mysql from 'mysql';
import moment from 'moment';

import openDbConnection from './helper/openDbConnection.js';
import uuid from '../Uuid/index.js';
import emptyLog from '../Logs/emptyLog.js';
import errorHandlerRaw from './errorHandler.js';
import insertToQueue from './runner/insertToQueue.js';
import queueRetrieve from './runner/queueRetrieve.js';
import jobCountManagerRaw from './runner/jobCountManager.js';
import { runInContext } from 'vm';

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
            workerLimit: {}
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

    let errorHandler = errorHandlerRaw({
        driver: driver,
        connection: usedConnection,
        tableName: tableName,
        runningTableName: runningTableName,
        retry: retry,
        log: log
    });
    let jobCountManager = jobCountManagerRaw({workerLimit});
    let once = () => {
        let context = {
            db: null,
            tableName: tableName,
            runningTableName: runningTableName,
            tag: tag,
            retry: retry
        };
        let jobUuid = uuid();
        return new Promise(openDbConnection(usedConnection))
            .then((db) => { 
                context.db = db;
                return new Promise(queueRetrieve(context)(jobUuid));
            })
            .then((selectStatement) => {
                if(selectStatement && selectStatement.length > 0){
                    let job = selectStatement[0];
                    return new Promise(jobCountManager.isJobOverLimit(job)).then((canRunJob) =>{
                        if(canRunJob){
                            if(context.db){
                                context.db.end();
                                context.db = null;
                            }

                            let scriptToRun = require(job.run_script);
                            log.messageln(`RUNNING: ${job.run_script}`);
                            if(!scriptToRun){
                                log.messageln(`ERROR: ${job.run_script} NOT FOUND`);
                                return Promise.resolve({
                                    run: false,
                                    code: "2",
                                    message: "Script not found"
                                });
                            }
                            let servicePromise = new Promise(scriptToRun(JSON.parse(job.params)))
                                .then((result) => {
                                    log.messageln(`DONE: ${job.run_script}`);
                                    return Promise.resolve({
                                        run: true,
                                        data: result
                                    });
                                })
                                .catch((err) => {
                                    return new Promise(errorHandler(jobUuid))
                                        .then((retryResult) => {
                                            log.messageln(`ERROR: ${job.run_script}`);
                                            return Promise.resolve({
                                                run: false,
                                                code: "2",
                                                message: "Error",
                                                error: err,
                                                retry: retryResult
                                            })
                                        });
                                });
                            new Promise(jobCountManager.add(jobUuid, job, servicePromise));
                            return servicePromise;
                        }
                        else{
                            return new Promise(insertToQueue(context)(job))
                            .then(() => {
                                if(context.db){
                                    context.db.end();
                                    context.db = null;
                                }
                                log.messageln(`WORKER LIMIT: ${job.run_script}`);
                                return Promise.resolve({
                                    run: false,
                                    code: "3",
                                    message: "Worker limit reached"
                                });
                            });
                        }
                    });
                }
                else{
                    return Promise.resolve({
                        run: false,
                        code: "1",
                        message: "No Job"
                    });
                }
            });
        };

    let listen = ({ interval = 5000 }) => {
        once().then((result) => {
            log.messageln(JSON.parse(result));
        });
        setInterval(once, interval);
    };

    return {
        once,
        listen
    }
};

export default runner;