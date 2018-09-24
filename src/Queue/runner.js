let { setInterval } = require('timers');
let mysql = require('mysql');
let moment = require('moment');
let { runInContext } = require('vm');

let openDbConnection = require('./helper/openDbConnection.js');
let uuid = require('../Uuid/index');
let emptyLog = require('../Logs/emptyLog.js');
let queueRetrieve = require('./runner/queueRetrieve.js');
let errorHandlerRaw = require('./runner/errorHandler.js');
let jobCountManagerRaw = require('./runner/jobCountManager.js');
let jobRunManagerRaw = require('./runner/jobRunManager.js');

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

module.exports = runner;