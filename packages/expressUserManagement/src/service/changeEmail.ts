const uuid = require('uuid/v4');
const debug = require('debug')("QzNode:expressUserManagement:service:changeEmail");
import userModelRaw from '../model/user';
import * as myType from '../types';

let changeEmail: myType.service.changeEmail = (context, lang) => async ({userId, email}) => {
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));
    let user = await userModel(context.db).findOne({
        where: {
            id: userId
        }
    });
    let pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!pattern.test(String(email).toLowerCase())){
        throw new Error(lang._("changeEmail.emailFormatInvalid", "Email not in correct format."));
    }

    if(user){
        user.email = email;
        user.is_confirmed = false;
        user.confirmation = uuid();
        await user.save();
        return {
            username: user.username,
            confirmation: user.confirmation
        };
    }
    else{
        throw new Error(lang._("general.notFound", "User not found."));
    }
};

export default changeEmail;