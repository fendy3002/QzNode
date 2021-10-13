import { BaseEntity, ParentChildAssociation, SiblingAssociation, BaseEntityModel as BaseEntityModelType } from '../types';

class BaseEntityModel implements BaseEntityModelType {
    constructor(baseEntity: BaseEntity) {
        this.baseEntity = baseEntity;
    }
    baseEntity: BaseEntity = null;
    parent: ParentChildAssociation[] = [];
    children: ParentChildAssociation[] = [];
    sibling: SiblingAssociation[] = [];

    entity() {
        return this.baseEntity;
    }
    hasMany(model, param) {
        let key = model.entity().name;
        if (this.children.some(k => k.key == key)) {
            return;
        }
        this.children.push({
            type: "parentChild",
            direction: "child",
            parentModel: this,
            childModel: model,
            as: param.as,
            key: key,
            childKey: param.childKey,
            parentKey: param.parentKey
        });
        model.belongsTo(this, {
            as: param.as,
            childKey: param.childKey,
            parentKey: param.parentKey
        });
    }
    hasOne(model, param) {
        let key = model.entity().name;
        if (this.sibling.some(k => k.key == key)) {
            return;
        }
        this.sibling.push({
            type: "sibling",
            myModel: this,
            siblingModel: model,
            key: key,
            as: param.as,
            myKey: param.myKey,
            siblingKey: param.siblingKey
        });
        model.hasOne(this, {
            as: param.as,
            myKey: param.siblingKey,
            siblingKey: param.myKey
        });
    }
    belongsTo(model, param) {
        let key = model.entity().name;
        if (this.parent.some(k => k.key == key)) {
            return;
        }
        this.parent.push({
            type: "parentChild",
            direction: "parent",
            parentModel: model,
            childModel: this,
            key: key,
            as: param.as,
            childKey: param.childKey,
            parentKey: param.parentKey
        });
        model.hasMany(this, {
            as: param.as,
            childKey: param.childKey,
            parentKey: param.parentKey
        });
    }
    association() {
        return {
            parent: this.parent,
            sibling: this.sibling,
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