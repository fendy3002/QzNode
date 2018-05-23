import { setInterval } from 'timers';
import mysql from 'mysql';
import moment from 'moment';
import { runInContext } from 'vm';

import openDbConnection from './helper/openDbConnection.js';
import uuid from '../Uuid/index.js';
import emptyLog from '../Logs/emptyLog.js';
import errorHandlerRaw from './errorHandler.js';
import insertToQueue from './runner/insertToQueue.js';
import queueRetrieve from './runner/queueRetrieve.js';
import jobCountManagerRaw from './runner/jobCountManager.js';
import getScriptPromise from './runner/getScriptPromise.js';

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
            retry: retry,
            log: log,
            logLevel: logLevel
        };
        let jobUuid = uuid();
        return new Promise(openDbConnection(usedConnection))
            .then((db) => { 
                context.db = db;
                return new Promise(queueRetrieve(context)(jobUuid));
            })
            .then((selectStatement) => {
                if(selectStatement && selectStatement.length > 0){
                    let job = {
                        ...selectStatement[0],
                        uuid: jobUuid
                    };
                    return new Promise(jobCountManager.isJobOverLimit(job)).then((canRunJob) =>{
                        if(canRunJob){
                            if(logLevel.start){
                                log.messageln(`START: ${job.run_script}`);
                            }
                            context.db.end();
                            context.db = null;
                            let servicePromise = getScriptPromise({workerLimit, log, logLevel}, job)
                                .then((result) => {
                                    if(logLevel.done){
                                        log.messageln(`DONE: ${job.run_script}`);
                                    }
                                    return Promise.resolve({
                                        run: true,
                                        data: result
                                    });
                                })
                                .catch((err) => {
                                    return new Promise(openDbConnection(usedConnection))
                                    .then((db) => { 
                                        context.db = db;
                                        return new Promise(errorHandler(jobUuid))
                                        .then((retryResult) => {
                                            let resolveResult = {
                                                run: false,
                                                code: "2",
                                                message: "Error",
                                                error: err,
                                                retry: retryResult
                                            };
                                            if(logLevel.error){
                                                log.messageln(`ERROR: ${job.run_script}`);
                                                log.messageln(`ERROR_RESULT: ` + JSON.stringify({
                                                    error: err,
                                                    retry: retryResult
                                                }));
                                            }
                                            return Promise.resolve(resolveResult);
                                        });
                                    });
                                });
                            new Promise(jobCountManager.add(jobUuid, job, servicePromise));
                            return servicePromise;
                        }
                        else{
                            return new Promise(insertToQueue(context)(job))
                            .then(() => {
                                if(logLevel.workerLimit){
                                    log.messageln(`WORKER LIMIT: ${job.run_script}`);
                                }
                                return Promise.resolve({
                                    run: false,
                                    code: "3",
                                    message: "Worker limit reached"
                                });
                            });
                        }
                    }).then((execResult) => {
                        return new Promise((resolve, reject) => {
                            if(context.db){
                                context.db.end((err) => {
                                    context.db = null;
                                    resolve(execResult);
                                });
                            }
                            else{
                                resolve(execResult);
                            }
                        });
                    });
                }
                else{
                    if(context.db){
                        context.db.end();
                        context.db = null;
                    }

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