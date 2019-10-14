import changePasswordServiceRaw from '../service/changePassword';
import * as myType from '../types';

let changePassword: myType.controller.changePassword = (context) => {
    return {
        _get: (req, res, next) => {
            res.render(context.render.changePassword, {});
        },
        _post: async (req, res, next) => {
            let changePasswordService = changePasswordServiceRaw(context.db, req.lang.part("auth"));
            try{
                await changePasswordService({
                    userid: req.session.user.id,
                    oldPassword: req.body.old_password,
                    newPassword: req.body.new_password,
                    confirmPassword: req.body.confirm_password,
                });
                return res.redirect(context.redirect.signedIn);
            } catch(ex){
                return res.render(context.render.changePassword, {err: ex.message, email: req.body.email});
            }
        }
    };
};
export default changePassword;