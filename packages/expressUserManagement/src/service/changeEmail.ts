const uuid = require('uuid/v4');
import userModelRaw from '../model/user';
import * as myType from '../types';

let changeEmail: myType.service.changeEmail = (context) => async ({userId, email}) => {
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));
    let user = await userModel(context.db).findOne({
        where: {
            id: userId
        }
    });
    let pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!pattern.test(String(email).toLowerCase())){
        throw new Error(context.lang.auth.changeEmail.emailFormatInvalid);
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
        throw new Error(context.lang.auth.general.notFound);
    }
};

export default changeEmail;