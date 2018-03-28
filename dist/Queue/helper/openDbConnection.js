'use strict';

var mysql = require('mysql');

var Service = function Service(dbConfig) {
    return function (resolve, reject) {
        var db = mysql.createPool({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            port: dbConfig.port,
            dateStrings: 'date',
            multipleStatements: true
        });
        resolve(db);

        // db.connect(function(err){
        //     if (err){
        //         reject(err);
        //     }
        //     else{
        //         resolve(db);
        //     }
        // });
    };
};

module.exports = Service;