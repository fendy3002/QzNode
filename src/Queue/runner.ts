let { setInterval } = require('timers');
let mysql = require('mysql');
let moment = require('moment');
let { runInContext } = require('vm');

let openDbConnection = require('./helper/openDbConnection');
let uuid = require('../Uuid/index');
let emptyLog = require('../Logs/emptyLog');
let queueRetrieve = require('./runner/queueRetrieve');
let errorHandlerRaw = require('./runner/errorHandler');
let jobCountManagerRaw = require('./runner/jobCountManager');
let jobRunManagerRaw = require('./runner/jobRunManager');

import * as thisTypes from './types';

interface RunnerParam {
    driver: string,
    connection: thisTypes.Connection,
    tableName: string,
    runningTableName: string,
    failedTableName: string,
    tag: string,
    retry: number,
    log: any,
    workerLimit: any,
    logLevel: thisTypes.LogLevel
};

let runner = (param: RunnerParam) => {
    let {
        driver,
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
    let logLevel: thisTypes.LogLevel = {
        start: false,
        error: true,
        done: true,
        scriptNotFound: true,
        workerLimit: false,
        noJob: false,

        ...param.logLevel
    };

    let connection = {
        ...{
            host: "localhost",
            database: "my_database",
            port: "3306",
            user: "root"
        },
        ...param.connection,
    };

    let context = {
        openDb: () => {
            return new Promise(openDbConnection(connection));
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
        logLevel: logLevel
    });
    let jobCountManager = jobCountManagerRaw({workerLimit});
    let jobRunManager = jobRunManagerRaw(context, jobCountManager, errorHandler);
    
    let once = () => {
        let jobUuid = uuid();
        return new Promise(queueRetrieve(context)(jobUuid))
            .then((selectStatement: any[]) => {
                if(selectStatement && selectStatement.length > 0){
                    let job: thisTypes.Job = {
                        ...selectStatement[0],
                        uuid: jobUuid
                    };
                    return new Promise(jobRunManager(jobUuid, job));
                }
                else{
                    if(logLevel.noJob){
                        log.messageln(`NO JOB`);
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

export = runner;