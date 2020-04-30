import fs = require('fs');
import path = require('path');
import lo = require('lodash');
import * as types from './types';
import padVersion from './padVersion';
import trimVersion from './trimVersion';
import logRaw from './log';
import schemaVersionModelConstructor from './schemaVersionModel';
let updateModelVersion: types.UpdateModelVersion = async (model, version) => {
    let paddedVersion = padVersion(version);
    return await model.update({
        __version: {
            $lt: paddedVersion
        }
    }, {
        $set: {
            __version: paddedVersion
        }
    }, {
        multi: true
    });
};
let service: types.MigrateServiceConstructor<any> = (config: types.MigrateConfig<any>) => {
    let log = logRaw(config.log);
    return {
        migrate: async () => {
            let schemaVersionModel = await schemaVersionModelConstructor(config);
            let migrationFiles = lo.orderBy(
                fs.readdirSync(config.dirpath)
            );
            let maxStoredVersionRecord = await schemaVersionModel.find().sort({ _id: -1 }).limit(1);
            let maxStoredVersion = "0000.0000.0000";
            if (!maxStoredVersionRecord || maxStoredVersionRecord.length > 0) {
                maxStoredVersion = maxStoredVersionRecord[0]._id;
            }
            log("Max version: " + maxStoredVersion, "info");

            for (let migrationFile of migrationFiles) {
                log("Checking migration: " + migrationFile, "info");
                let fullPath = path.join(config.dirpath, migrationFile);
                let fileVersion = path.basename(migrationFile).split("__")[0];
                fileVersion = fileVersion.replace("V", "");
                let paddedVersion = padVersion(fileVersion);
                if (paddedVersion > maxStoredVersion) {
                    log("Running migration: " + migrationFile, "info");
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
                        log("Running migration: " + migrationFile + " done", "info");
                        await insertedVersion.save();
                    } catch (err) {
                        insertedVersion.status = "error";
                        insertedVersion.log.push({
                            type: "error",
                            at: new Date().getTime(),
                            message: err.toString(),
                        });
                        log("Running migration: " + migrationFile + " error", "error");
                        log(err.toString(), "error");

                        await insertedVersion.save();
                        throw err;
                    }
                }
            }
        }
    }
};
export default service;