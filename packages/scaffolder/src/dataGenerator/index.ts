import { generateField } from './generateField';
import { generateIDMap } from './generateIDMap';
import { generateRelation } from './generateRelation';
import { BaseEntityModelManager, DataGenerator } from '../types';
export const generate = (manager: BaseEntityModelManager, config?: DataGenerator.Configuration) => {
    let idMap = generateIDMap(manager, config);
    idMap = generateRelation(manager, idMap);
    idMap = generateField(manager, idMap);
    return idMap;
};