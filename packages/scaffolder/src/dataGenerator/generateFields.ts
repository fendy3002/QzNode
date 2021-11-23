import { math } from '@fendy3002/qz-node';
import * as nanoid from 'nanoid';
import * as types from '../types';
import * as dataSource from './dataSource';

const pickRandom = (arr: any[]) => {
    let index = math.randBetweenInt(0, arr.length - 1)
    return arr[index];
};
const generateFieldValue = (field: types.BaseEntityField) => {
    if (field.dataGeneration?.hint) {
        switch (+field.dataGeneration?.hint) {
            case types.DataGeneratorFieldHint.address:
                return pickRandom(dataSource.address);
            case types.DataGeneratorFieldHint.brand:
                return pickRandom(dataSource.brand);
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
                return pickRandom(dataSource.text);
            case types.DataGeneratorFieldHint.nanoid:
                return nanoid.nanoid(Math.min(20, field.length));
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
                let value = generateFieldValue(field);
            }
        }
    }
    return idMap;
};
