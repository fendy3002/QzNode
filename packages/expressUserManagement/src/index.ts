import * as myType from './types';

import defaultLang from './lang/en';
import apiUserManagementRaw from './api/userManagement';
import apiConfirmationRaw from './api/confirmation';
import loginController from './controller/login';
import logoutController from './controller/logout';
import changePasswordController from './controller/changePassword';
import {default as middleware} from './middleware/index';

let combine = (...path: string[]) => {
    return path.join("/").replace(/\/\//gi, "/");
};
export let init = async (initContext: myType.initContext, app: any) => {
    const context: myType.context = {
        rememberTokenName: "usermanagement_remember",
        registerNeedConfirmation: true,
        render: {
            login: "auth/login.html",
            changePassword: "auth/changePassword.html",
        },
        redirect: {
            signedIn: "/",
            signedOut: "/auth/login"
        },
        path: {
            auth: "/auth",
            userApi: "/api/user-management/user",
            userConfirmApi: "/api/user/confirmation",
        },
        lang: defaultLang(initContext),
        ...initContext
    }
    let apiUserManagement = await apiUserManagementRaw(context);
    let apiConfirmation = await apiConfirmationRaw(context);

    app.get(
        combine(context.path.auth, "/login"), 
        middleware.signedIn(context)({mustSignedIn: false}),
        loginController(context)._get);
    app.post(
        combine(context.path.auth, "/login"), 
        middleware.signedIn(context)({mustSignedIn: false}),
        loginController(context)._post);
    app.get(
        combine(context.path.auth, "/logout"), 
        middleware.signedIn(context)({mustSignedIn: true}),
        logoutController(context)._get);
    app.get(
        combine(context.path.auth, "/change-password"), 
        middleware.signedIn(context)({mustSignedIn: true}),
        changePasswordController(context)._get);
    app.post(
        combine(context.path.auth, "/change-password"), 
        middleware.signedIn(context)({mustSignedIn: true}),
        changePasswordController(context)._post);
    
    app.get(context.path.userApi, apiUserManagement.list);
    app.get(combine(context.path.userApi , '/current'), apiUserManagement.current);
    app.get(combine(context.path.userApi , '/:id'), apiUserManagement.get);
    app.post(context.path.userApi, apiUserManagement.register);
    app.post(combine(context.path.userApi, '/:id/change-email'), apiUserManagement.changeEmail);
    app.post(combine(context.path.userApi, '/:id/change-super-admin'), apiUserManagement.superAdmin);
    app.post(combine(context.path.userApi, '/:id/active'), apiUserManagement.active);
    app.post(combine(context.path.userApi, '/:id/reset-password'), apiUserManagement.resetPassword);
    app.post(combine(context.path.userApi, '/:id/confirmation'), apiUserManagement.confirmation);
    app.post(combine(context.path.userApi, '/:id/role'), apiUserManagement.setRole);
    app.post(context.path.userConfirmApi, apiConfirmation._get);
};

import role from './model/role';
import roleAccess from './model/roleAccess';
import user from './model/user';
import userRememberToken from './model/userRememberToken';
import userRole from './model/userRole';
export let models = {
    role,
    roleAccess,
    user,
    userRememberToken,
    userRole,
};