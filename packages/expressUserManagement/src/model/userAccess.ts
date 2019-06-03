import * as myTypes from '../types';
let sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let userAccess = db.define('user_access', {
        userid: {type: sequelize.STRING(36), primaryKey: true},
        module: {type: sequelize.STRING, primaryKey: true},
        access: {type: sequelize.STRING, primaryKey: true}
    }, {
        tableName: "user_access",
        timestamps: false,
    });

    return userAccess;
}, {
    // used when defining association
    associate: (db, model) => {
        model.belongsTo(
            require('./user.js')(db), 
            { 
                as: 'user',
                foreignKey: 'userid',
                targetKey: "id"
            });
        return model;
    }
});

export default modelService;