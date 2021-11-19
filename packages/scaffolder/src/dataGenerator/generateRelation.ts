import { math } from '@fendy3002/qz-node';
import * as types from '../types';

interface MappedAssociation {
    [fromEntityName: string]: {
        to: {
            [toEntityName: string]: boolean
        }
    }
};

const mapKey = (association: types.ParentChildAssociation, childRow: any, parentRow: any) => {
    for (let relation of association.relation) {
        childRow[relation.childKey] = parentRow[relation.parentKey];
    }
}

export const generateRelation = (manager: types.BaseEntityModelManager, idMap: types.DataGenerator.GeneratedIDSet) => {
    let models = manager.getModels();
    const mappedAssociation: MappedAssociation = {};
    for (let eachModel of models) {
        if (eachModel.association()?.children?.length ||
            eachModel.association()?.parent?.length) {
            let entity = eachModel.entity();
            for (let association of eachModel.association().children) {
                let childEntityName = association.childModel.entity().name;
                if (mappedAssociation[entity.name]?.to[childEntityName]) {
                    continue;
                }
                else {
                    let parentData = idMap[entity.name].data;
                    for (let row of idMap[childEntityName].data) {
                        let chosenParent = parentData[math.randBetweenInt(0, parentData.length)];
                        mapKey(association, row, chosenParent);
                    }

                    mappedAssociation[entity.name] = mappedAssociation[entity.name] ?? {
                        to: {}
                    };
                    mappedAssociation[entity.name].to[childEntityName] = true;
                }
            }
        }
    }
    return mappedAssociation;
};
