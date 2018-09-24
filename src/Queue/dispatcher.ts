export {};

import * as moment from 'moment';
let mysql = require('mysql');
let momentTz = require('moment');
let openDbConnection = require('./helper/openDbConnection.js');
let uuidGen = require('../Uuid/index');

let dispatcher = (param:object = {}): object => {
    let {driver,
        connection,
        tableName,
        timezone} = {
            ...{
                driver: "mysql",
                connection: {},
                tableName: "qz_queue",
                timezone: "Etc/GMT"
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
        ...connection
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
        return new Promise(openDbConnection(usedConnection)).then((db:any) => {
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

module.exports = dispatcher;