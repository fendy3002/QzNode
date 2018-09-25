let mysql = require('mysql');

let Service = (dbConfig) => (resolve, reject) => {
    let db = mysql.createPool({
        host     : dbConfig.host,
        user     : dbConfig.user,
        password : dbConfig.password,
        database : dbConfig.database,
        port     : dbConfig.port,
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

export = Service;