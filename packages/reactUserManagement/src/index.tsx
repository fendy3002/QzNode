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
            changeEmail: "/api/user-management/{id}/change-email",
            changeSuperAdmin: "/api/user-management/{id}/change-super-admin",
            changeActive: "/api/user-management/{id}/active",
            resetPassword: "/api/user-management/{id}/reset-password",
            getUsers: "/api/user-management",
            getUser: "/api/user-management/{id}",
            getCurrentUser: "/api/user-management/current",
            register: "/api/user-management",
        },
        handle: {
            resError: (err, res) => {
                return Promise.resolve({
                    message: res.body.message
                });
            }
        },
        headers: {

        }
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