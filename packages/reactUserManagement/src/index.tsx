let React = require('react');
let ReactDOM = require('react-dom');
let sa = require('superagent');
let lo = require('lodash');
let MobxReact = require('mobx-react');

let {App} = require('./App.tsx');
let {store} = require('./store/store.tsx');

export const reactUserManagement = (elem, option) => {
    const useOption = lo.merge({
        apiPath: {
        },
        headers: {
            Authorization: ""
        },
    }, option);
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