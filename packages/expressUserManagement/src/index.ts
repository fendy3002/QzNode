import * as myType from './types';

import apiUserManagementRaw from './api/userManagement';
import apiConfirmationRaw from './api/confirmation';
let combine = (...path: string[]) => {
    return path.join("/").replace(/\/\//gi, "/");
};
let index = {
    init: async (initContext: myType.initContext, app) => {
        const context: myType.context = {
            rememberTokenName: "usermanagement_remember",
            registerNeedConfirmation: true,
            render: {
                login: "auth.login",
                changePassword: "auth.changePassword",
            },
            redirect: {
                signedIn: "/",
                signedOut: "/auth/login"
            },
            path: {
                userApi: "/api/user-management/user",
                userConfirmApi: "/api/user/confirmation",
            },
            lang: require('./lang/en'),
            ...initContext
        }
        let apiUserManagement = await apiUserManagementRaw(context);
        let apiConfirmation = await apiConfirmationRaw(context);

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
        
    },
};
export default index;