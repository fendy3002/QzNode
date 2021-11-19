import { BaseEntityModel } from '../../../src/baseEntity/baseEntityModel';
import { BaseEntityDataType, DataGeneratorFieldHint } from '../../../src/types';

export default new BaseEntityModel({
    name: "MyModelNanoid",
    fields: {
        MyProp1: {
            dataType: BaseEntityDataType.string, length: 14,
            dataGeneration: {
                hint: DataGeneratorFieldHint.nanoid
            },
            primaryKey: true
        },
        MyModelKey: { dataType: BaseEntityDataType.guid },
        MyModelNumberKey: { dataType: BaseEntityDataType.integer },

        MyProp2: { dataType: BaseEntityDataType.string, length: 50, create: { editable: true } },
        MyProp3: { dataType: BaseEntityDataType.decimal, length: 10, decimalScale: 2, create: { editable: true } },
        MyProp4: { dataType: BaseEntityDataType.boolean, create: { editable: true } },
    },
});