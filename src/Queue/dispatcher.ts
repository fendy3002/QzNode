import * as moment from 'moment';
let mysql = require('mysql');
let momentTz = require('moment');
let openDbConnection = require('./helper/openDbConnection');
let uuidGen = require('../Uuid/index');

import * as thisTypes from './types';

interface DispatcherParam {
    driver: string,
    connection: thisTypes.Connection,
    tableName: string,
    timezone: string
};

let dispatcher = (param:DispatcherParam): object => {
    let {driver,
        tableName,
        timezone} = {
            ...{
                driver: "mysql",
                tableName: "qz_queue",
                timezone: "Etc/GMT"
            },
            ...param
        };
    let connection = {
        ...{
            host: "localhost",
            database: "my_database",
            port: "3306",
            user: "root"
        },
        ...param.connection
    };

    let dispatch = (scriptPath: string, param:object = {}, {
        tag = "default",
        priority = 3,
        when = null,
        key = null
    } = {}): Promise<any> => {
        let utcInsert:string = moment.utc().format("YYYY-MM-DDTHH:mm:ss");
        if(when){
            utcInsert = momentTz(when, timezone).utc().format("YYYY-MM-DDTHH:mm:ss");
        }

        let escTableName: string = tableName;
        return new Promise(openDbConnection(connection)).then((db:any) => {
            return new Promise((resolve, reject) => {
                let queueUuid = uuidGen();
                let query = db.query(`INSERT INTO ${escTableName} SET ?`, {
                    'tag': tag,
                    'utc_run': utcInsert,
                    'run_script': scriptPath,
                    'params': JSON.stringify(param),
                    'priority': priority,
                    'uuid': queueUuid,
                    'key': key,
                    'retry': 0,
                    'utc_created': moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
                }, (err, results) => {
                    db.end();
                    if(err){ reject(err); }
                    else{ resolve({
                        uuid: queueUuid,
                        key: key
                        //results: results
                    }); }
                });
            });
        });
    };
    return {
        dispatch
    };
};

export = dispatcher;