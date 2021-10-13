import { BaseEntityModel } from '../../../src/baseEntity/baseEntityModel';
import { BaseEntityDataType } from '../../../src/types';

export default new BaseEntityModel({
    name: "MyModel",
    fields: {
        MyProp1: { dataType: BaseEntityDataType.string, length: 50 },
        MyProp2: { dataType: BaseEntityDataType.decimal, length: 10, decimalScale: 2 },
    },
});