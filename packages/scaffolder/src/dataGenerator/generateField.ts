import { math } from '@fendy3002/qz-node';
import * as nanoid from 'nanoid';
import * as types from '../types';
import * as dataSource from './dataSource';

const pickRandom = (arr: any[]) => {
    let index = math.randBetweenInt(0, arr.length - 1)
    return arr[index];
};
const maxLength = (value: string, field: types.BaseEntityField) => {
    if (!field.length) {
        return value;
    } else {
        return value.substring(0, field.length);
    }
};
const generateFieldValue = (field: types.BaseEntityField) => {
    if (field.dataGeneration?.hint) {
        switch (+field.dataGeneration?.hint) {
            case types.DataGeneratorFieldHint.address:
                return maxLength(pickRandom(dataSource.address), field);
            case types.DataGeneratorFieldHint.brand:
                return maxLength(pickRandom(dataSource.brand), field);
            case types.DataGeneratorFieldHint.country:
                return pickRandom(dataSource.country);
            case types.DataGeneratorFieldHint.countrycode:
                return pickRandom(dataSource.countrycode);
            case types.DataGeneratorFieldHint.email:
                return pickRandom(dataSource.email);
            case types.DataGeneratorFieldHint.fullName:
                return pickRandom(dataSource.name);
            case types.DataGeneratorFieldHint.firstName:
                return pickRandom(dataSource.name.map(k => k.split(" ")[0]));
            case types.DataGeneratorFieldHint.lastName:
                return pickRandom(dataSource.name.map(k => k.split(" ")[1] ?? ""));
            case types.DataGeneratorFieldHint.text:
                return maxLength(pickRandom(dataSource.text), field);
            case types.DataGeneratorFieldHint.nanoid:
                return nanoid.nanoid(Math.min(20, field.length));
        }
    } else {
        if ([
            types.BaseEntityDataType.text,
            types.BaseEntityDataType.string,
        ].some(k => k == field.dataType)) {
            return maxLength(pickRandom(dataSource.text), field);
        } else if ([
            types.BaseEntityDataType.integer,
            types.BaseEntityDataType.bigint,
        ].some(k => k == field.dataType)) {
            return math.randBetweenInt(0, 9999);
        } else if ([
            types.BaseEntityDataType.smallint,
            types.BaseEntityDataType.tinyint,
        ].some(k => k == field.dataType)) {
            return math.randBetweenInt(0, 255);
        } else if ([
            types.BaseEntityDataType.decimal,
        ].some(k => k == field.dataType)) {
            return math.randBetween(0, 9999);
        } else if ([
            types.BaseEntityDataType.boolean,
        ].some(k => k == field.dataType)) {
            return math.randBetweenInt(0, 1) == 1;
        }
    }
    return null;
};

export const generateField = (manager: types.BaseEntityModelManager, idMap: types.DataGenerator.GeneratedIDSet) => {
    let models = manager.getModels();
    for (let eachModel of models) {
        let entity = eachModel.entity();
        let fields = entity.fields;
        let modelMap = idMap[entity.name];
        for (let fieldName of Object.keys(fields)) {
            let field = fields[fieldName];
            if (field.primaryKey) { continue; }
            for (let i = 0; i < modelMap.data.length; i++) {
                let row = modelMap.data[i];
                if (!row[fieldName]) {
                    let value = generateFieldValue(field);
                    row[fieldName] = value;
                }
            }
        }
    }
    return idMap;
};
