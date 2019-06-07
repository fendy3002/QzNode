import userRememberTokenModelRaw from '../model/userRememberToken';
import * as myType from '../types';

let logout : myType.controller.logout = (context) => {
    let userRememberTokenModel = userRememberTokenModelRaw(context.db);
    return {
        _get: (req, res, next) => {
            const listenerUuid = req.session.listenerUuid;
    
            req.session.destroy();
            let selector = req.cookies[context.rememberTokenName + "_selector"];
            userRememberTokenModel(context.db).destroy({
                where: {
                    selector: selector
                }
            }).then(() => {
                res.clearCookie(context.rememberTokenName + "_selector");
                res.clearCookie(context.rememberTokenName + "_key");
                let redirectTo = context.redirect.signedOut;
                if(listenerUuid){
                    redirectTo = redirectTo + "?listener=" + listenerUuid;
                }
                return res.redirect(redirectTo);
            });
        }
    };
};
export default logout;