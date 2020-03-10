import modelVersion from "./modelVersion";
import migrateService from './migrateService';
export { MigrateRequest } from './types';

export default {
    version: modelVersion,
    migration: migrateService
};