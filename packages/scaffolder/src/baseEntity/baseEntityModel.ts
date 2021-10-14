import { BaseEntity, ParentChildAssociation, BaseEntityModel as BaseEntityModelType } from '../types';

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
    hasMany(model, param) {
        let key = model.entity().name;
        if (this.children.some(k => k.key == key)) {
            return;
        }
        this.children.push({
            direction: "child",
            many: true,
            parentModel: this,
            childModel: model,
            as: param.as,
            key: key,
            relation: param.relation,
        });
        model.belongsTo(this, {
            as: param.as,
            relation: param.relation,
        });
    }
    hasOne(model, param) {
        let key = model.entity().name;
        if (this.children.some(k => k.key == key)) {
            return;
        }
        this.children.push({
            direction: "child",
            many: false,
            parentModel: this,
            childModel: model,
            as: param.as,
            key: key,
            relation: param.relation,
        })
        model.belongsTo(this, {
            as: param.as,
            relation: param.relation,
        });
    }
    belongsTo(model, param) {
        let key = model.entity().name;
        if (this.parent.some(k => k.key == key)) {
            return;
        }
        this.parent.push({
            direction: "parent",
            many: param.many,
            parentModel: model,
            childModel: this,
            key: key,
            as: param.as,
            relation: param.relation
        });
        if (param.many) {
            model.hasMany(this, {
                as: param.as,
                relation: param.relation
            });
        } else {
            model.hasOne(this, {
                as: param.as,
                relation: param.relation
            });
        }
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