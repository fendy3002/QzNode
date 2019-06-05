let bcrypt = require('bcrypt');
let sequelize = require('sequelize');
import userModelRaw from '../model/user';
import userRememberTokenModelRaw from '../model/userRememberToken';
import * as myType from '../types';

let changePassword: myType.service.changePassword = (context) => async ({userid, oldPassword, newPassword, confirmPassword}) => {
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));
    let userRememberTokenModel = userRememberTokenModelRaw(context.db);

    let userWhere = {
        [sequelize.Op.or]: {
            id: userid
        }
    };
    if(newPassword != confirmPassword){
        throw new Error(context.lang.auth.changePassword.confirmError);
    }
    else{
        let changeUser = await userModel.findOne({ where: userWhere });
        if(changeUser){
            let same = await new Promise((resolve, reject) => {
                bcrypt.compare(oldPassword, changeUser.password, (err, same) => {
                    if(err){ reject(err); }
                    resolve(same)
                });
            });
            if(same){
                const saltRounds = 10;
                await new Promise((resolve, reject) => {
                    bcrypt.hash(newPassword, saltRounds, function(err, hashed) {
                        changeUser.password = hashed;
                        changeUser.save().then(resolve);
                    });
                });
                await userRememberTokenModel.destroy({
                    where: {
                        userid: changeUser.id
                    }
                });
                return;
            }
            else{
                throw new Error(context.lang.auth.changePassword.oldPasswordNotMatch);
            }
        }
        else{
            throw new Error(context.lang.auth.changePassword.notFound);
        }
    }
};

export default changePassword;