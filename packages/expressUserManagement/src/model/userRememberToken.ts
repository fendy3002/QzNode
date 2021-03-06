import * as myTypes from '../types';
import userModel from './user';
let sequelize = require('sequelize');

let modelService: myTypes.modelType = Object.assign((db) => {
    let userRememberToken = db.define('user_remember_token', {
        selector: sequelize.INTEGER,
        hashedValidator: {type: sequelize.STRING, field: "hashed_validator"},
        userid: sequelize.STRING(36),
        expires: sequelize.DATE
    }, {
        tableName: "user_remember_token",
        timestamps: false,
    });

    return userRememberToken;
}, {
    // used when defining association
    associate: (db, model) => {
        model.belongsTo(
            userModel(db),
            {
                as: "user",
                foreignKey: "userid",
                targetKey: "id"
            });
        return model;
    }
});

export default modelService;