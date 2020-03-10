import mongoose = require('mongoose');
export interface MigrateConfig<T> {
    dirpath: string,
    schemaVersion: {
        collectionName: string
    },
    mongoose: any,
    context: T
};
export interface MigrateRequestConfig<T> extends MigrateConfig<T> {
    version: string,
    schemaVersionModel: mongoose.Model<any>
};

export interface MigrateServiceConstructor<T> {
    (config: MigrateConfig<T>): MigrateService
};
export interface MigrateService {
    migrate: () => Promise<void>
};
export interface MigrateRequest<T> {
    migrate: (config: MigrateRequestConfig<T>) => Promise<void>
};