import { BaseEntityModel } from './baseEntityModel';
import { BaseEntityModelManager, BaseEntityModel as BaseEntityModelType, BaseEntity } from '../types';

class ManagerService implements BaseEntityModelManager {
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