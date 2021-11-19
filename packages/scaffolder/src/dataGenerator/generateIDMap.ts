import { v4 as uuid } from 'uuid';
import * as nanoid from 'nanoid';
import * as types from '../types';

interface GenerationContextSet {
    [fieldName: string]: GenerationContext
};
interface GenerationContext {
    incrementKey: number
};
const generatePrimaryKey = (field: types.BaseEntityField, context: GenerationContext) => {
    if (field.dataType == types.BaseEntityDataType.guid) {
        return uuid();
    } else if ([
        types.BaseEntityDataType.bigint,
        types.BaseEntityDataType.smallint,
        types.BaseEntityDataType.tinyint,
        types.BaseEntityDataType.integer,
    ].some(k => k == field.dataType)) {
        let currentKey = context.incrementKey;
        context.incrementKey++;
        return currentKey;
    } else if (field.dataGeneration?.hint == types.DataGeneratorFieldHint.nanoid) {
        return nanoid.nanoid(Math.min(20, field.length));
    }
};
export const generateIDMap = (manager: types.BaseEntityModelManager, config?: types.DataGenerator.Configuration) => {
    let defaultRowCount = config?.rowCount ?? 10;
    let models = manager.getModels();
    let result: types.DataGenerator.GeneratedIDSet = {};
    for (let eachModel of models) {
        let entity = eachModel.entity();
        let rowCount = entity.dataGeneration?.rowCount ?? defaultRowCount;
        result[entity.name] = {
            data: []
        };
        let entityResult = result[entity.name];
        const generationContext: GenerationContextSet = {};
        let fields = entity.fields;
        for (let i = 0; i < rowCount; i++) {
            let rowKey: any = {};
            for (let fieldName of Object.keys(fields)) {
                if (!generationContext[fieldName]) {
                    generationContext[fieldName] = {
                        incrementKey: 1
                    };
                }
                let field = fields[fieldName];
                if (field.primaryKey) {
                    rowKey[fieldName] = generatePrimaryKey(field, generationContext[fieldName]);
                }
            }
            entityResult.data.push(rowKey);
        }
    }

    return result;
};