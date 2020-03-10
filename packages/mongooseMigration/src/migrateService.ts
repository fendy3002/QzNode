import fs = require('fs');
import path = require('path');
import * as types from './types';
import padVersion from './padVersion';
import schemaVersionModelConstructor from './schemaVersionModel';
let updateModelVersion: types.UpdateModelVersion = async (model, version) => {
    let paddedVersion = padVersion(version);
    return await model.update({
        __version: {
            $ne: paddedVersion
        }
    }, {
        $set: {
            __version: paddedVersion
        }
    });
};
let service: types.MigrateServiceConstructor<any> = (config: types.MigrateConfig<any>) => {
    return {
        migrate: async () => {
            let schemaVersionModel = await schemaVersionModelConstructor(config);
            let migrationFiles = fs.readdirSync(config.dirpath);
            for (let migrationFile of migrationFiles) {
                let fileVersion = path.basename(migrationFile).split("__")[0];
                fileVersion = fileVersion.replace("V", "");
                let paddedVersion = padVersion(fileVersion);
                
            }
        }
    }
};
export default service;