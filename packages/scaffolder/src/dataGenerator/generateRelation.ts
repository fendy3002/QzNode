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
            for (let association of eachModel.association().children.concat(
                eachModel.association().parent
            )) {
                let childEntityName = association.childModel.entity().name;
                let parentEntityName = association.parentModel.entity().name;
                if (mappedAssociation[parentEntityName]?.to[childEntityName]) {
                    continue;
                }
                else {
                    let parentData = idMap[parentEntityName].data;
                    for (let row of idMap[childEntityName].data) {
                        let chosenParent = parentData[math.randBetweenInt(0, parentData.length - 1)];
                        mapKey(association, row, chosenParent);
                    }

                    mappedAssociation[parentEntityName] = mappedAssociation[parentEntityName] ?? {
                        to: {}
                    };
                    mappedAssociation[parentEntityName].to[childEntityName] = true;
                }
            }
        }
    }
    return idMap;
};
