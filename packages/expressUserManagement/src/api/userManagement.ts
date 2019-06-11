const httpError = require('http-errors');
const uuid = require('uuid/v4');
import registerServiceRaw from '../service/register';
import changeEmailServiceRaw from '../service/changeEmail';
import resetPasswordServiceRaw from '../service/resetPassword';
import userModelRaw from '../model/user';
import * as myType from '../types';

let userManagement: myType.api.userManagement = (context) => {
    const registerService = registerServiceRaw(context);
    const changeEmailService = changeEmailServiceRaw(context);
    const resetPasswordService = resetPasswordServiceRaw(context);
    const userModel = userModelRaw(context);
    return {
        active: async (req, res, next) => {
            try{
                let userId = req.params.id;
                let is_active = req.body.is_active;
                let user = await userModel.findOne({
                    id: userId
                });
                user.isActive = is_active;
                await user.save();

                return res.json({
                    message: context.lang.auth.changeActive.success
                });
            } catch (ex){
                return next(new httpError(500, ex));
            }
        },
        confirmation: async (req, res, next) => {
        },
        current: async (req, res, next) => {
        },
        get: async (req, res, next) => {
        },
        list: async (req, res, next) => {
        },
        setRole: async (req, res, next) => {
        },
        superAdmin: async (req, res, next) => {
            try{
                let userId = req.params.id;
                let is_super_admin = req.body.is_super_admin;
                let user = await userModel.findOne({
                    id: userId
                });
                user.isSuperAdmin = is_super_admin;
                await user.save();

                return res.json({
                    message: context.lang.auth.changeSuperAdmin.success
                });
            } catch (ex){
                return next(new httpError(500, ex));
            }
        },
        changeEmail: async (req, res, next) => {
            try{
                let userId = req.params.id;
                let {email} = req.body;
                let {username, confirmation} = await changeEmailService({
                    userId: userId,
                    email: email
                });

                await context.mail.changeEmail({
                    username,
                    confirmation
                });
                return res.json({
                    message: context.lang.auth.changeEmail.success
                })
            } catch (ex){
                return next(new httpError(500, ex));
            }
        },
        register: async (req, res, next) => {
            let {name, username, email} = req.body;
            let password = uuid().replace(/\-/gi, "").substring(0, 10);
            let userid,
                needConfirmation,
                confirmation;
            try{
                ({
                    userid,
                    needConfirmation,
                    confirmation,
                } = await registerService({
                    name: name, 
                    username: username, 
                    email: email, 
                    password: password,
                    superAdmin: false
                }));
            } catch(ex){
                return next(new httpError(500, ex.message));
            };
            
            try{
                await context.mail.adminRegister({
                    username: username,
                    password: password,
                    confirmation: confirmation,
                    name: name
                });
            } catch(ex){
                return next(new httpError(500, context.lang.auth.register.registerEmailFail.replace("{err}", ex.message)));
            };

            return res.json({
                message: context.lang.auth.register.registerSuccess.replace("{password}", password)
            });
        },
        resetPassword: async (req, res, next) => {
            try{
                let {password} = await resetPasswordService({
                    email: req.body.email
                });
                await context.mail.adminResetPassword({
                    password: password
                });
                
                return res.json({
                    message: "ok"
                });
            } catch (ex){
                return next(new httpError(500, ex));
            }
        },
    }
};
export default userManagement;