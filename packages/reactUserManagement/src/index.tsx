let React = require('react');
let ReactDOM = require('react-dom');
let sa = require('superagent');
let lo = require('lodash');
let MobxReact = require('mobx-react');

let {App} = require('./App.tsx');
let {store} = require('./store/store.tsx');

import * as storeTypes from './store/typeDefinition';

export const reactUserManagement = (elem, option) => {
    const defaultOption : storeTypes.storeContextConfig = {
        apiPath: {
            changeEmail: "/api/user-management/user/{id}/change-email",
            changeSuperAdmin: "/api/user-management/user/{id}/change-super-admin",
            changeActive: "/api/user-management/user/{id}/active",
            resetPassword: "/api/user-management/user/{id}/reset-password",
            resendConfirmation:  "/api/user-management/user/{id}/confirmation",
            getUsers: "/api/user-management/user",
            getUser: "/api/user-management/user/{id}",
            getCurrentUser: "/api/user-management/user/current",
            getRoles: "/api/user-management/role",
            register: "/api/user-management/user",
        },
        handle: {
            resError: (err, res) => {
                if(res.body){
                    return Promise.resolve({
                        message: res.body.message
                    });
                } else {
                    return Promise.resolve({
                        message: err
                    });
                }
            }
        },
        headers: {

        },
        root: "/"
    };
    require('toastr').options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "100",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    const useOption : storeTypes.storeContextConfig = lo.merge(defaultOption, option);
    let storeInstance = new store({
        config: useOption
    });
    ReactDOM.render(
        <MobxReact.Provider store={storeInstance}>
            <App/>
        </MobxReact.Provider>,
        elem
    );
};