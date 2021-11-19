import { BaseEntity, ParentChildAssociation, BaseEntityModel as BaseEntityModelType } from '../types';

interface RelationParamsType {
    as: string,
    relation: {
        parentKey: string,
        childKey: string,
    }[],
    required?: boolean
};
class BaseEntityModel implements BaseEntityModelType {
    constructor(baseEntity: BaseEntity) {
        this.baseEntity = baseEntity;
    }
    baseEntity: BaseEntity = null;
    parent: ParentChildAssociation[] = [];
    children: ParentChildAssociation[] = [];

    entity() {
        return this.baseEntity;
    }
    hasMany(model: BaseEntityModelType, params: RelationParamsType) {
        let key = model.entity().name;
        if (this.children.some(k => k.key == key)) {
            return;
        }
        this.children.push({
            direction: "child",
            many: true,
            parentModel: this,
            childModel: model,
            as: params.as,
            key: key,
            relation: params.relation,
            required: params.required ?? false
        });
    }
    hasOne(model: BaseEntityModelType, params: RelationParamsType) {
        let key = model.entity().name;
        if (this.children.some(k => k.key == key)) {
            return;
        }
        this.children.push({
            direction: "child",
            many: false,
            parentModel: this,
            childModel: model,
            as: params.as,
            key: key,
            relation: params.relation,
            required: params.required ?? false
        })
    }
    belongsTo(model: BaseEntityModelType, params: RelationParamsType) {
        let key = model.entity().name;
        if (this.parent.some(k => k.key == key)) {
            return;
        }
        this.parent.push({
            direction: "parent",
            many: false,
            parentModel: model,
            childModel: this,
            key: key,
            as: params.as,
            relation: params.relation,
            required: params.required ?? false
        });
    }
    association() {
        return {
            parent: this.parent,
            children: this.children
        };
    }
}
const fromBaseEntity = (baseEntity: BaseEntity): BaseEntityModel => {
    return new BaseEntityModel(baseEntity);
};

export {
    fromBaseEntity,
    BaseEntityModel
};