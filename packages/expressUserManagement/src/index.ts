import express = require('express');
import lo = require('lodash');

import * as myType from './types';

import defaultLang from './lang/en';
import apiUserManagementRaw from './api/userManagement';
import apiConfirmationRaw from './api/confirmation';
import apiRoleRaw from './api/role';
import loginController from './controller/login';
import logoutController from './controller/logout';
import changePasswordController from './controller/changePassword';
import middleware from './middleware/index';
import jwtVerifyRaw from './middleware/jwtVerify';
import hasAccessModule from './middleware/hasAccessModule';

let combine = (...path: string[]) => {
    return path.join("/").replace(/\/\//gi, "/");
};
export let init = async (initContext: myType.initContext, app: any) => {
    const context: myType.context = lo.merge({
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
            roleApi: "/api/user-management/role"
        },
        lang: defaultLang(initContext)
    }, initContext);

    let apiUserManagement = await apiUserManagementRaw(context);
    let apiConfirmation = await apiConfirmationRaw(context);
    let apiRole = await apiRoleRaw(context);
    let jwtVerify = jwtVerifyRaw({
        appPublicKey: context.appPublicKey,
        sessionStore: context.sessionStore
    });

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
    
    const userApiRoutes = express.Router();
    userApiRoutes.use(jwtVerify);
    
    userApiRoutes.get('/', hasAccessModule("user", "list"), apiUserManagement.list);
    userApiRoutes.get('/current', apiUserManagement.current);
    userApiRoutes.get('/:id', hasAccessModule("user", "view"), apiUserManagement.get);
    userApiRoutes.post('/', hasAccessModule("user", "add"), apiUserManagement.register);
    userApiRoutes.post('/:id/change-email', hasAccessModule("user", "edit"), apiUserManagement.changeEmail);
    userApiRoutes.post('/:id/change-super-admin', hasAccessModule("user", "edit"), apiUserManagement.superAdmin);
    userApiRoutes.post('/:id/active', hasAccessModule("user", "edit"), apiUserManagement.active);
    userApiRoutes.post('/:id/reset-password', hasAccessModule("user", "edit"), apiUserManagement.resetPassword);
    userApiRoutes.post('/:id/confirmation', hasAccessModule("user", "edit"), apiUserManagement.confirmation);
    userApiRoutes.post('/:id/role', hasAccessModule("user", "edit"), apiUserManagement.setRole);
    
    app.use(context.path.userApi, userApiRoutes);
    app.post(context.path.userConfirmApi, apiConfirmation._post);
    app.get(context.path.roleApi, apiRole._get);

    return context;
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
export {default as middleware} from './middleware';
export {myType as type};