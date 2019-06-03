const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const moment = require('moment');
const random = require("random-js")();
const uuid = require('uuid/v4');
import userModelRaw from '../model/user';
import userRememberTokenModelRaw from '../model/userRememberToken';
import * as crypto from "crypto";
import * as myType from '../types';

const loginService: myType.service.login = (context) => async (user, rememberMe = false) => {
    let {username, password} = user;
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));
    let userRememberTokenModel = userRememberTokenModelRaw(context.db);

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

    let userWhere = {
        isActive: true,
        [sequelize.Op.or]: {
            username: username,
            email: username
        }
    };
    let existingUser = await userModel.findAll({ where: userWhere });
    if(existingUser && existingUser.length > 0){
        let loginUser = existingUser[0];
        let compareSame = await new Promise((resolve, reject) => {
            bcrypt.compare(password, loginUser.password, (err, same) => {
                if(err){ return reject(err); }
                return resolve(same);
            });
        });
        if(compareSame){
            let selector = await getSelectorNumber();
            if(!rememberMe){
                return {
                    user: loginUser
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
                    user: loginUser,
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