import path from 'path';
import fs from 'fs';
import schemaClassGenerator from './SchemaClassGenerator.js';

let SchemaFileGenerator = (context) => (filepath) => (resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
        let schemaJson = JSON.parse(data);

    });
};

export default SchemaFileGenerator;