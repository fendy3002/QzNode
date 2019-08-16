import userRememberTokenModelRaw from '../model/userRememberToken';
import * as myType from '../types';

let logout : myType.controller.logout = (context) => {
    let userRememberTokenModel = userRememberTokenModelRaw(context.db);
    return {
        _get: async (req, res, next) => {
            const listenerUuid = req.session.listenerUuid;
    
            let selector = req.cookies[context.rememberTokenName + "_selector"];
            // without selector means not remember me session
            if(selector){
                await userRememberTokenModel.destroy({
                    where: {
                        selector: selector
                    }
                });
            }

            await req.session.destroy();
            res.clearCookie(context.rememberTokenName + "_selector");
            res.clearCookie(context.rememberTokenName + "_key");
            let redirectTo = context.redirect.signedOut;
            if(listenerUuid){
                redirectTo = redirectTo + "?listener=" + listenerUuid;
            }
            return res.redirect(redirectTo);
        }
    };
};
export default logout;