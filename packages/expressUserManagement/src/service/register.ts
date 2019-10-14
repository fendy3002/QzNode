const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const moment = require('moment');
const debug = require('debug')("QzNode:expressUserManagement:service:debug");
const lo = require('lodash');
const uuid = require('uuid/v4');
import userModelRaw from '../model/user';
import * as myType from '../types';

const registerService : myType.service.register = (context, lang) => async (user) => {
    let {name, username, email, password, superAdmin = false} = user;
    let userModel = userModelRaw(context.db);
    
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if(!username.match(usernameRegex)){
        debug("Username do not match format");
        throw new Error(lang._("register.usernameFormat", "Username not in correct format."));
    }
    if(email.indexOf("@") < 0){
        debug("Email do not match format");
        throw new Error(lang._("register.emailFormat", "Email not in correct format."));
    }

    let userWhere = {
        [sequelize.Op.or]: {
            username: username,
            email: email
        }
    };
    const existingUser = await userModel.findAll({ where: userWhere, raw: true });
    if(existingUser && existingUser.length > 0){
        debug("User exists");
        let errMessage = lang._(
            "register.exists",
            "",
            {
                username: username,
                email: email,
            }
        )
        throw new Error(errMessage);
    }
    const saltRounds = 10;
    let confirmation = uuid();
    let hashed = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hashed) {
            if(err){ return reject(err); }
            return resolve(hashed);
        });
    });
    debug("Hashed password: " + hashed);
    let userid = uuid();
    debug("Register userid: " + userid);
    await userModel.create({
        id: userid,
        name: name,
        username: username,
        email: email,
        password: hashed,
        is_confirmed: !context.registerNeedConfirmation,
        is_active: false,
        is_super_admin: superAdmin,
        confirmation: confirmation,
        utc_created: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        utc_updated: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
    });
    
    return {
        userid: userid,
        needConfirmation: context.registerNeedConfirmation,
        confirmation: confirmation
    };
};
export default registerService;