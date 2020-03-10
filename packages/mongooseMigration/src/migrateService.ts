import fs = require('fs');
import path = require('path');
import lo = require('lodash');
import * as types from './types';
import padVersion from './padVersion';
import trimVersion from './trimVersion';
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
                    let insertedVersion: any = await schemaVersionModel.create({
                        _id: paddedVersion,
                        version: trimVersion(paddedVersion),
                        fileName: migrationFile,
                        status: "pending",
                        migratedAt: new Date().getTime()
                    });
                    try {
                        await migrateRequest.migrate({
                            ...config,
                            version: paddedVersion,
                            schemaVersionModel: schemaVersionModel,
                            updateModelVersion: updateModelVersion
                        });
                        insertedVersion.status = "done";
                        await insertedVersion.save();
                    } catch (err) {
                        insertedVersion.status = "error";
                        insertedVersion.log.push({
                            type: "error",
                            at: new Date().getTime(),
                            message: err.toString(),
                        });
                        await insertedVersion.save();
                        throw err;
                    }
                }
            }
        }
    }
};
export default service;