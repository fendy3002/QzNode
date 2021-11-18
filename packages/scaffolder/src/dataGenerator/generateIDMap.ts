import * as types from '../types';
export const generateIDMap = (manager: types.BaseEntityModelManager, config: types.DataGenerator.Configuration) => {
    let models = manager.getModels();
    let result = {}
};