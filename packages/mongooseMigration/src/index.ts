import modelVersion from "./modelVersion";
import migrateService from './migrateService';
import padVersion from './padVersion';
import trimVersion from './trimVersion';

export { MigrateRequest } from './types';

export default {
    version: modelVersion,
    migration: migrateService,
    padVersion: padVersion,
    trimVersion: trimVersion,
};