import { BaseEntityModel } from '../../../src/baseEntity/baseEntityModel';
import { BaseEntityDataType } from '../../../src/types';
import BaseEntityModelSingle from './BaseEntityModelSingle';

let parentModel = new BaseEntityModel({
    name: "MyParentModel",
    fields: {
        MyProp1: { dataType: BaseEntityDataType.string, length: 50, create: { editable: true } },
        MyProp2: { dataType: BaseEntityDataType.decimal, length: 10, decimalScale: 2, create: { editable: true } },
    },
});

parentModel.hasMany(BaseEntityModelSingle, {
    as: "myChild",
    parentKey: "MyProp1",
    childKey: "MyProp2"
});
export default parentModel;