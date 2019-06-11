import * as myTypes from '../types';
const sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let user = db.define('user', {
        id: {type: sequelize.STRING(36), primaryKey: true},
        name: {type: sequelize.STRING(255) },
        username: {type: sequelize.STRING(255) },
        email: {type: sequelize.STRING(100) },
        password: {type: sequelize.STRING(255) },
        confirmation: {type: sequelize.STRING(36) },
        isConfirmed: {type: sequelize.BOOLEAN, field: "is_confirmed"},
        isActive: {type: sequelize.BOOLEAN, field: "is_active"},
        isSuperAdmin: {type: sequelize.BOOLEAN, field: "is_super_admin"},
        utcCreated: {type: sequelize.DATE, field: "utc_created"},
        utcUpdated: {type: sequelize.DATE, field: "utc_updated"},
    }, {
        tableName: "user",
        timestamps: false,
    });

    return user;
}, {
    // used when defining association
    associate: (db, model) => {
        model.hasMany(
            require('./userRememberToken')(db), 
            { 
                as: 'rememberTokens',
                foreignKey: 'userid',
                sourceKey: "id"
            });
        model.hasMany(
            require('./userAccess')(db), 
            { 
                as: 'accessModules',
                foreignKey: 'userid',
                sourceKey: "id"
            });
        return model;
    }
});

export default modelService;