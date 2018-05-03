import path from 'path';
import fs from 'fs';

let GeneratorService = (context) => () => {
    let {rootPath, config, log} = context;
    let schemaFolder = path.join(rootPath, config.schema);
    let converterFolder = path.join(rootPath, config.converter);
    log.messageLn("START:\t generate schema from schema in folder: " + schemaFolder);

    let schemaList = [];
    let passConfig = {
        "dateFormat": "YYYY-MM-DD",
        "dateTimeFormat": "YYYYY-MM-DD H:m:s",
        ...config
    };

    new Promise((resolve, reject) => {
        fs.readdir(schemaFolder, (err, files) => {
            resolve(files);
        });
    }).then((files) => {
        
    });
};

export default GeneratorService;