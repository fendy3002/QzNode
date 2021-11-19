import { BaseEntityModel } from '../../../src/baseEntity/baseEntityModel';
import { BaseEntityDataType } from '../../../src/types';

export default new BaseEntityModel({
    name: "MyModel",
    fields: {
        MyProp1: { dataType: BaseEntityDataType.guid, primaryKey: true },
        MyProp2: { dataType: BaseEntityDataType.string, length: 50, create: { editable: true } },
        MyProp3: { dataType: BaseEntityDataType.decimal, length: 10, decimalScale: 2, create: { editable: true } },
        MyProp4: { dataType: BaseEntityDataType.boolean, create: { editable: true } },
    },
});