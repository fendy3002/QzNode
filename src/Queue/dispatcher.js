let mysql = require('mysql');
let moment = require('moment');
let momentTz = require('moment');
let openDbConnection = require('./helper/openDbConnection.js');

let dispatcher = (param = {}) => {
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

    let dispatch = (scriptPath, param = {}, {
        tag = "default",
        priority = 3,
        when = null
    }) => {
        let utcInsert = null;
        if(when){
            utcInsert = momentTz(when, timezone).utc().format("YYYY-MM-DDTHH:mm:ss");
        }

        let escTableName = tableName;
        return new Promise(openDbConnection(usedConnection)).then((db) => {
            return new Promise((resolve, reject) => {
                let query = db.query(`INSERT INTO ${escTableName} SET ?`, {
                    'tag': tag,
                    'utc_run': utcInsert,
                    'run_script': scriptPath,
                    'params': JSON.stringify(param),
                    'priority': priority,
                    'retry': 0,
                    'utc_created': moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
                }, (err, results) => {
                    if(err){ reject(err); }
                    else{ resolve(results); }
                });
            });
        });
    };
    return {
        dispatch
    };
};

export default dispatcher;