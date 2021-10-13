import { BaseEntityModel } from './baseEntityModel';
import { BaseEntity, BaseEntityModel as BaseEntityModelType } from '../types';
class Manager {
    models: BaseEntityModelType[] = [];
    modelKey: any = {};
    async addEntity(baseEntity: BaseEntity) {
        let obj = new BaseEntityModel(baseEntity);
        this.models.push(obj);
        this.modelKey[baseEntity.name] = obj;
    }
    async addModel(baseEtityModel: BaseEntityModelType) {
        this.models.push(baseEtityModel);
        this.modelKey[baseEtityModel.entity().name] = baseEtityModel;
    }
    async getModel(baseEntityName: string) {
        return this.modelKey[baseEntityName];
    }
};
export default Manager;