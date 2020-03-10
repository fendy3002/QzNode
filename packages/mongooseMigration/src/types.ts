import mongoose = require('mongoose');
export interface MigrateConfig<T> {
    dirpath: string,
    schemaVersion: {
        collectionName: string
    },
    mongoose: mongoose.Mongoose,
    context: T,
    log: {
        level: string,
        write: (message: string) => Promise<void>
    }
};
export interface MigrateRequestPayload<T> extends MigrateConfig<T> {
    version: string,
    schemaVersionModel: mongoose.Model<any>,
    updateModelVersion: UpdateModelVersion
};
export interface UpdateModelVersion {
    (model: mongoose.Model<any>, version: string): Promise<void>
}
export interface MigrateServiceConstructor<T> {
    (config: MigrateConfig<T>): MigrateService
};
export interface MigrateService {
    migrate: () => Promise<void>
};
export interface MigrateRequest<T> {
    migrate: (payload: MigrateRequestPayload<T>) => Promise<void>
};