const Mongoose = require('mongoose');
import * as types from './types';

export default async (migrateConfig: types.MigrateConfig<any>) => {
    const modelName = 'document';
    try {
        // if already defined, return 
        return migrateConfig.mongoose.model(modelName);
    } catch (ex) {
        const Schema = Mongoose.Schema;
        const definedSchema = new Schema({
            _id: String, // padded version
            version: String, // trimmed version
            fileName: String,
            status: String,
            migratedAt: Number,
            log: [{
                type: String,
                at: Number,
                message: String
            }]
        }, {
            collection: migrateConfig.schemaVersion.collectionName,
            toJSON: {
                virtuals: false
            }
        });
        return migrateConfig.mongoose.model(modelName, definedSchema);
    }
};