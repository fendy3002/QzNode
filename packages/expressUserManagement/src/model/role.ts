import * as myTypes from '../types';
let sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let role = db.define('role', {
        id: {type: sequelize.STRING(36), primaryKey: true},
        name: {type: sequelize.STRING, primaryKey: true},
        utc_created: {type: sequelize.DATE},
        created_by: {type: sequelize.STRING},
        utc_updated: {type: sequelize.DATE},
        updated_by: {type: sequelize.STRING},
    }, {
        tableName: "role",
        timestamps: false,
    });

    return role;
}, {
    // used when defining association
    associate: (db, model) => {
        return model;
    }
});

export default modelService;