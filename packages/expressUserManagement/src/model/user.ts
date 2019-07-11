import * as myTypes from '../types';
import userRememberToken from './userRememberToken';
import userRole from './userRole';
const sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let user = db.define('user', {
        id: {type: sequelize.STRING(36), primaryKey: true},
        name: {type: sequelize.STRING(255) },
        username: {type: sequelize.STRING(255) },
        email: {type: sequelize.STRING(100) },
        password: {type: sequelize.STRING(255) },
        confirmation: {type: sequelize.STRING(36) },
        is_confirmed: {type: sequelize.BOOLEAN, field: "is_confirmed"},
        is_active: {type: sequelize.BOOLEAN, field: "is_active"},
        is_super_admin: {type: sequelize.BOOLEAN, field: "is_super_admin"},
        created_by: {type: sequelize.STRING, field: "created_by"},
        updated_by: {type: sequelize.STRING, field: "updated_by"},
        utc_created: {type: sequelize.DATE, field: "utc_created"},
        utc_updated: {type: sequelize.DATE, field: "utc_updated"},
    }, {
        tableName: "user",
        timestamps: false,
    });

    return user;
}, {
    // used when defining association
    associate: (db, model) => {
        model.hasMany(
            userRememberToken(db), 
            { 
                as: 'rememberTokens',
                foreignKey: 'userid',
                sourceKey: "id"
            });
        model.hasMany(
            userRole(db), 
            { 
                as: 'accessModules',
                foreignKey: 'userid',
                sourceKey: "id"
            });
        return model;
    }
});

export default modelService;