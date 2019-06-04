const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const moment = require('moment');
const lo = require('lodash');
const uuid = require('uuid/v4');
import userModelRaw from '../model/user';
import * as myType from '../types';

const registerService : myType.service.register = (context, option) => async (user) => {
    let useOption = lo.merge(option, {
        needEmailConfirmation: true
    });
    let {name, username, email, password, confirm, superAdmin = false} = user;
    let userModel = userModelRaw(context.db);
    
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    const lang = context.lang;
    if(!username.match(usernameRegex)){
        throw new Error(lang.auth.register.usernameFormat);
    }
    if(email.indexOf("@") < 0){
        throw new Error(lang.auth.register.emailFormat);
    }
    if(password !== confirm){
        throw new Error(lang.auth.register.confirmError);
    }

    let userWhere = {
        [sequelize.Op.or]: {
            username: username,
            email: email
        }
    };
    const existingUser = await userModel.findAll({ where: userWhere });
    if(existingUser && existingUser.length > 0){
        throw new Error(lang.auth.register.exists
            .replace("{username}", username)
            .replace("{email}", email));
    }
    const saltRounds = 10;
    let confirmation = uuid();
    let hashed = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hashed) {
            if(err){ return reject(err); }
            return resolve(hashed);
        });
    });
    await userModel.create({
        name: name,
        username: username,
        email: email,
        password: hashed,
        isConfirmed: !useOption.needEmailConfirmation,
        isActive: false,
        isSuperAdmin: superAdmin,
        confirmation: confirmation,
        utcCreated: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        utcUpdated: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
    });
    
    return {
        needConfirmation: useOption.needEmailConfirmation,
        confirmation: confirmation
    };
};
export default registerService;