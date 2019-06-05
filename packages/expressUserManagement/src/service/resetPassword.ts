let bcrypt = require('bcrypt');
let sequelize = require('sequelize');
const uuid = require('uuid/v4');
import userModelRaw from '../model/user';
import userRememberTokenModelRaw from '../model/userRememberToken';
import * as myType from '../types';

let resetPasswordService: myType.service.resetPassword = (context) => async ({email}) => {
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));
    let userRememberTokenModel = userRememberTokenModelRaw(context.db);
    
    let userWhere = {
        [sequelize.Op.or]: {
            email: email
        }
    };
    let resetUser = await userModel.findOne({ where: userWhere })
    if(resetUser){
        let newPassword = uuid().replace(/\-/gi, "").substring(0, 8);
        const saltRounds = 10;
        const hashed = await new Promise((resolve, reject) => {
            bcrypt.hash(newPassword, saltRounds, function(err, hashed) {
                if(err){ reject(err); }
                return resolve(hashed);
            });
        });
        resetUser.password = hashed;
        await resetUser.save();
        await userRememberTokenModel.destroy({
            where: {
                userid: resetUser.id
            }
        });
        return {password: newPassword};
    }
    else{
        throw new Error(context.lang.auth.general.notFound);
    }
};

export default resetPasswordService;