const httpError = require('http-errors');
const uuid = require('uuid/v4');
const Sequelize = require('sequelize');
const debug = require('debug')("QzNode:expressUserManagement:api:userManagement");
import registerServiceRaw from '../service/register';
import changeEmailServiceRaw from '../service/changeEmail';
import resetPasswordServiceRaw from '../service/resetPassword';
import userModelRaw from '../model/user';
import roleAccessModelRaw from '../model/roleAccess';
import roleModelRaw from '../model/role';
import userRoleModelRaw from '../model/userRole';
import * as myType from '../types';

import {type as langType} from '@fendy3002/lang';

let lang = (req) => {
    return req.lang.part("auth") as langType.Pack;
}

let userManagement: myType.api.userManagement = (context) => {
    const registerService = registerServiceRaw(context);
    const changeEmailService = changeEmailServiceRaw(context.db);
    const resetPasswordService = resetPasswordServiceRaw(context);
    const userModel = userModelRaw(context.db);
    const roleAccessModel = roleAccessModelRaw(context.db);
    const roleModel = roleModelRaw(context.db);
    const userRoleModel = userRoleModelRaw(context.db);

    const getRoleByUserIdArray = async (userIds: string[]) => {
        const userRoles = await userRoleModel.findAll({
            where: {
                userid: {
                    [Sequelize.Op.in]: userIds
                }
            },
            raw: true
        });
        const roleAccesses = await roleAccessModel.findAll({
            where: {
                role_id: {
                    [Sequelize.Op.in]: userRoles.map(k => k.role_id)
                }
            },
            raw: true
        });
        const roles = await roleModel.findAll({
            where: {
                id: {
                    [Sequelize.Op.in]: userRoles.map(k => k.role_id)
                }
            },
            raw: true
        });

        let result = {};
        for(let userId of userIds){
            result[userId] = userRoles.filter(k => k.user_id == userId)
                .map(userRole => {
                    return {
                        ...roles.filter(k => k.id == userRole.role_id)[0],
                        accesses: roleAccesses.map(roleAccess => {
                            return {
                                module: roleAccess.module,
                                access: roleAccess.access
                            };
                        })
                    };
                });
        }
        return result;
    };

    return {
        active: async (req, res, next) => {
            try{
                let userId = req.params.id;
                let is_active = req.body.is_active;
                let user = await userModel.findOne({
                    where: {
                        id: userId
                    },
                });
                user.is_active = is_active;
                await user.save();

                return res.json({
                    message: lang(req)._("changeActive.success", "Change active success.")
                });
            } catch (ex){
                return next(new httpError(500, ex.message));
            }
        },
        confirmation: async (req, res, next) => {
            let userId = req.params.id;
            let user = await userModel.findOne({
                where: {
                    id: userId
                },
                raw: true
            });
            if(user){
                await context.mail.resendConfirmation({
                    username: user.username,
                    name: user.name,
                    confirmation: user.confirmation
                });
                return res.json({
                    message: lang(req)._("resendConfirmation.success", "Resend confirmation success.")
                });
            }
            else{
                return res.status(404).end();
            }
        },
        current: async (req, res, next) => {
            let userId = (await context.auth(req, res)).id;
            if(userId){
                let user = await userModel.findOne({
                    where: {
                        id: userId
                    },
                    raw: true
                });
                let roles = await getRoleByUserIdArray([userId]);
                return res.json({
                    ...user,
                    roles: roles[userId]
                });
            }
            else{
                return res.status(404).end();
            }
        },
        get: async (req, res, next) => {
            let userId = req.params.id;
            let user = await userModel.findOne({
                where: {
                    id: userId
                },
                raw: true
            });
            if(user){
                let roles = await getRoleByUserIdArray([userId]);
                return res.json({
                    ...user,
                    roles: roles[userId]
                });
            }
            else{
                return res.status(404).end();
            }
        },
        list: async (req, res, next) => {
            let page = req.query.page || 1;
            let limit = req.query.limit || 20;
            let userResult = await userModel.findAndCountAll({
                limit: limit * 1,
                offset: (page - 1) * limit,
                raw: true
            });
            let users = userResult.rows;
            let userCount = userResult.count;
            let roles = await getRoleByUserIdArray(users.map(k => k.id));

            res.set({
                'X-Total-Count': userCount.length
            });
            return res.json(users.map(k => {
                return {
                    ...k,
                    roles: roles[k.id]
                };
            }));
        },
        setRole: async (req, res, next) => {
            let userId = req.params.id;
            let roleIdList = req.body.roles.map(k => k.id);
            let userRoles = roleIdList.map(k => {
                return {
                    role_id: k,
                    userid: userId
                };
            })
            try{
                await new Promise((resolve) => {
                    context.db.transaction(t => {
                        userRoleModel.destroy({
                            where: {
                                id: {
                                    $in: roleIdList
                                }
                            },
                            transaction: t
                        }).then(() => {
                            userRoleModel.bulkCreate(userRoles, {
                                transaction: t
                            })
                        });
                    }).then(() => {resolve()});
                });
                return res.json({
                    message: lang(req)._("setRole.success", "Set role success.")
                });
            } catch(ex){
                return next(new httpError(500, ex.message));
            }
        },
        superAdmin: async (req, res, next) => {
            try{
                let userId = req.params.id;
                let is_super_admin = req.body.is_super_admin;
                let user = await userModel.findOne({
                    where: {
                        id: userId
                    },
                });
                user.is_super_admin = is_super_admin;
                await user.save();

                return res.json({
                    message: lang(req)._("changeSuperAdmin.success", "Change super admin success.")
                });
            } catch (ex){
                return next(new httpError(500, ex.message));
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
                    message: lang(req)._('changeEmail.success', "Change email success.")
                })
            } catch (ex){
                return next(new httpError(500, ex.message));
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
                    name: name,
                    email: email
                });
            } catch(ex){
                let errMessage = lang(req)._(
                    "register.successButEmailFail", 
                    "User has been successfully registered, but there are error when sending the confirmation email {err}.", {
                        err: ex.message
                    });
                return next(new httpError(500, errMessage));
            };

            if(context.registerNeedConfirmation){
                let successMessage = lang(req)._(
                    "register.success", 
                    "User has been successfully registered and an email confirmation has been sent. The user need to confirm the email first before login.", 
                    {
                        password: password
                    });
                return res.json({
                    message: successMessage
                });
            }
            else{
                let successMessage = lang(req)._(
                    "register.noConfirmationSuccess",
                    "User has been successfully registered with password {password} . The password cannot be recovered by any means. Please change as soon as you able to.",
                    {
                        password: password
                    });
                return res.json({
                    message: successMessage
                });
            }
        },
        resetPassword: async (req, res, next) => {
            let password = null;
            let email = null;
            let userid = req.params.id;
            try{
                let resetPasswordResult = (await resetPasswordService({
                    userid: userid
                }))
                password = resetPasswordResult.password;
                email = resetPasswordResult.email;
            } catch (ex){
                return next(new httpError(500, ex.message, ex));
            }
            try{
                await context.mail.adminResetPassword({
                    password: password,
                    email: email
                });
            } catch (ex){
                let errMessage = lang(req)._(
                    "resetPassword.mailFailSend",
                    "User password has been reset, but e-mail with new password is failed to be sent. Please try again later or contact your system administrator. {err}",
                    {
                        err: ex.message
                    });
                return next(
                    new httpError(
                        500, 
                        errMessage,
                        ex
                    )
                );
            }
            if(context.registerNeedConfirmation){
                let message = lang(req)._(
                    "resetPassword.success",
                    "User reset password success.",
                    {
                        password: password
                    });
                return res.json({
                    message: message
                });
            }
            else{
                let message = lang(req)._(
                    "resetPassword.noConfirmationSuccess",
                    "User password has been reset to {password}.",
                    {
                        password: password
                    });
                return res.json({
                    message: message
                });
            }
        },
    }
};
export default userManagement;