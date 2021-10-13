import { BaseEntityModel } from './baseEntityModel';
import { BaseEntity, BaseEntityModel as BaseEntityModelType } from '../types';
export interface Manager {
    addEntity: (baseEntity: BaseEntity) => void,
    addModel: (baseEntity: BaseEntityModelType) => void,
    getModel: (baseEntityName: string) => BaseEntityModelType,
    getModels: (baseEntityName: string) => BaseEntityModelType[],
};
class ManagerService implements Manager {
    models: BaseEntityModelType[] = [];
    modelKey: any = {};
    addEntity(baseEntity: BaseEntity) {
        let obj = new BaseEntityModel(baseEntity);
        this.models.push(obj);
        this.modelKey[baseEntity.name] = obj;
    }
    addModel(baseEtityModel: BaseEntityModelType) {
        this.models.push(baseEtityModel);
        this.modelKey[baseEtityModel.entity().name] = baseEtityModel;
    }
    getModel(baseEntityName: string) {
        return this.modelKey[baseEntityName];
    }
    getModels() {
        return this.models;
    }
};
export default ManagerService;