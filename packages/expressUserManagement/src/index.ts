import * as myType from './types';

import apiUserManagementRaw from './api/userManagement';
import apiConfirmationRaw from './api/confirmation';
let index = {
    init: async (context: myType.context, app) => {
        let apiUserManagement = await apiUserManagementRaw(context);
        let apiConfirmation = await apiConfirmationRaw(context);
        app.get('/api/user-management/user', apiUserManagement.list);
        app.get('/api/user-management/user/current', apiUserManagement.current);
        app.get('/api/user-management/user/:id', apiUserManagement.get);
        app.post('/api/user-management/user', apiUserManagement.register);
        app.post('/api/user-management/user/:id/change-email', apiUserManagement.changeEmail);
        app.post('/api/user-management/user/:id/change-super-admin', apiUserManagement.superAdmin);
        app.post('/api/user-management/user/:id/active', apiUserManagement.active);
        app.post('/api/user-management/user/:id/reset-password', apiUserManagement.resetPassword);
        app.post('/api/user-management/user/:id/confirmation', apiUserManagement.confirmation);
        app.post('/api/user-management/user/:id/role', apiUserManagement.setRole);
        
    },
};
export default index;