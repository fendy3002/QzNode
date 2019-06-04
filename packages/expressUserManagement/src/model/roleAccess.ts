import * as myTypes from '../types';
let sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let roleAccess = db.define('role_access', {
        role_id: {type: sequelize.STRING(36), primaryKey: true},
        module: {type: sequelize.STRING(50), primaryKey: true},
        access: {type: sequelize.STRING(50), primaryKey: true},
    }, {
        tableName: "role_access",
        timestamps: false,
    });

    return roleAccess;
}, {
    // used when defining association
    associate: (db, model) => {
        return model;
    }
});

export default modelService;