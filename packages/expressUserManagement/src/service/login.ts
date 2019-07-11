const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const moment = require('moment');
import {Random} from "random-js";
const uuid = require('uuid/v4');
const lo = require('lodash');
const debug = require('debug')("QzNode:expressUserManagement:service:login");
import userModelRaw from '../model/user';
import userRememberTokenModelRaw from '../model/userRememberToken';
import userRoleModelRaw from '../model/userRole';
import roleAccessModelRaw from '../model/roleAccess';

import * as crypto from "crypto";
import * as myType from '../types';
const random = new Random();

const loginService: myType.service.login = (context, option) => async (user, rememberMe = false) => {
    let {username, password} = user;

    let useOption = lo.merge(option, {
        accessModule: {}
    });
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));
    let userRememberTokenModel = userRememberTokenModelRaw(context.db);
    let userRoleModel = userRoleModelRaw(context.db);
    let roleAccessModel = roleAccessModelRaw(context.db);

    let getSelectorNumber = async () => {
        let selector: number = random.integer(0, 100000);
        let rememberToken = await userRememberTokenModel.findOne({
            where: {
                selector: selector
            }
        });
        if(rememberToken) { return await getSelectorNumber(); }
        else{ return selector; }
    };
    let getPermission = async (user) => {
        let roles = await userRoleModel.findAll({
            where: {
                userid: user.id
            },
            raw: true
        });
        let roleAccess = await roleAccessModel.findAll({
            where: {
                role_id: {
                    [sequelize.Op.in]: roles.map(k => k.role_id)
                }
            },
            raw: true
        });
        let reducedRoleAccess = {};
        for(let each of roleAccess){
            reducedRoleAccess[each.module] = reducedRoleAccess[each.module] || {};
            reducedRoleAccess[each.module][each.access] = true;
        }

        let reducedAppRoleAccess = {};
        lo.forOwn(useOption.accessModule, (access, moduleName) => {
            reducedAppRoleAccess[moduleName] = reducedAppRoleAccess[moduleName] || {};
            Object.keys(access).forEach(k => {
                reducedAppRoleAccess[moduleName][k] = false;
            });
        });
        return lo.merge(reducedAppRoleAccess, reducedRoleAccess);
    };

    let userWhere = {
        is_active: true,
        [sequelize.Op.or]: {
            username: username,
            email: username
        }
    };
    let existingUser = await userModel.findAll({ where: userWhere, raw: true });
    if(existingUser && existingUser.length > 0){
        let loginUser = existingUser[0];
        let compareSame = await new Promise((resolve, reject) => {
            bcrypt.compare(password, loginUser.password, (err, same) => {
                if(err){ return reject(err); }
                return resolve(same);
            });
        });
        if(compareSame){
            let permissions = await getPermission(loginUser);

            let selector = await getSelectorNumber();
            if(!rememberMe){
                return {
                    user: {
                        ...loginUser,
                        accessModule: permissions
                    }
                };
            }
            else{
                let publicKey = uuid();
                let rememberTokenKey = crypto.createHmac("sha256", publicKey)
                    .update(selector.toString()).digest("hex");
                let expire = moment.utc().add(7, "days").format("YYYY-MM-DD HH:mm:ss");
    
                await userRememberTokenModel.create({
                    selector: selector,
                    hashedValidator: rememberTokenKey,
                    userid: loginUser.id,
                    expires: expire
                })
                return {
                    user: {
                        ...loginUser,
                        accessModule: permissions
                    },
                    publicKey: publicKey,
                    selector: selector
                };
            }
        }
        else{
            throw new Error(context.lang.auth.login.notMatch);
        }
    }
    else{
        throw new Error(context.lang.auth.login.notMatch);
    }
};
export default loginService;