import fs = require('fs');
import path = require('path');
import lo = require('lodash');
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
            let migrationFiles = lo.orderBy(
                fs.readdirSync(config.dirpath)
            );
            let maxStoredVersionRecord = (await schemaVersionModel.aggregate([
                {
                    $project: {
                        maxVersion: {
                            $max: "$_id"
                        }
                    }
                }
            ]))[0];
            for (let migrationFile of migrationFiles) {
                let fullPath = path.join(config.dirpath, migrationFile);
                let fileVersion = path.basename(migrationFile).split("__")[0];
                fileVersion = fileVersion.replace("V", "");
                let paddedVersion = padVersion(fileVersion);
                if (paddedVersion < maxStoredVersionRecord.maxVersion) {
                    let migrateRequest: types.MigrateRequest<any> = (await import(fullPath)).default;
                    await migrateRequest.migrate({
                        ...config,
                        version: paddedVersion,
                        schemaVersionModel: schemaVersionModel,
                        updateModelVersion: updateModelVersion
                    });
                }
            }
        }
    }
};
export default service;