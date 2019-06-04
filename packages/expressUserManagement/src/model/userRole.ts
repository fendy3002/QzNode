import * as myTypes from '../types';
let sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let userRole = db.define('user_role', {
        role_id: {type: sequelize.STRING(36), primaryKey: true},
        userid: {type: sequelize.STRING(36), primaryKey: true},
    }, {
        tableName: "user_role",
        timestamps: false,
    });

    return userRole;
}, {
    // used when defining association
    associate: (db, model) => {
        model.belongsTo(
            require('./user')(db), 
            {
                as: 'user',
                foreignKey: 'userid',
                targetKey: "id"
            });
        model.belongsTo(
            require('./role')(db), 
            { 
                as: 'role',
                foreignKey: 'role_id',
                targetKey: "id"
            });

        return model;
    }
});

export default modelService;