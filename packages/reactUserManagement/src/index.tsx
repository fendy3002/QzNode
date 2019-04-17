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
            getUsers: "/api/user-management",
            getUser: "/api/user-management/{id}",
            register: "/api/user-management",
        },
        headers: {

        }
    };
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