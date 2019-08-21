let mobx = require('mobx');
const sa = require('superagent');
const toastr = require('toastr');
let {observable} = mobx;
let {listStore} = require('./listStore.tsx');
let {createStore} = require('./createStore.tsx');
let {roleStore} = require('./roleStore.tsx');
const urlRouter = require('@fendy3002/url-router').default;

import * as typeDefinition from './typeDefinition';

export class store implements typeDefinition.store {
    constructor(context) {
        this.context = context;
        [
            'loading',
            'setPage',
            'initialize',
            'uninitialize',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.listStore = new listStore(this);
        this.createStore = new createStore(this);
        this.roleStore = new roleStore(this);

        const self = this;
        this.urlRouter = urlRouter({
            routes: [
                {
                    label: 'list',
                    path: '/',
                    data: self.listStore,
                    callback : (data) => {
                        const activeStore = data.route.data;
                        self.mode = {
                            name: data.route.label,
                            store: activeStore
                        };
                        return data.route.data.loadUsers();
                    }
                },
                {
                    label: 'create',
                    path: '/create',
                    data: self.createStore,
                    callback : (data) => {
                        const activeStore = data.route.data;
                        self.mode = {
                            name: data.route.label,
                            store: activeStore
                        };
                    }
                },
                {
                    label: 'role',
                    path: '/:id/role',
                    data: self.roleStore,
                    callback : (data) => {
                        const activeStore = data.route.data;
                        self.mode = {
                            name: data.route.label,
                            store: activeStore
                        };

                        activeStore.userId = data.routeParam.id;
                        activeStore.user = null;
                        activeStore.selectedRoles = [];
                        return activeStore.loadRoles().then(() => {
                            return activeStore.loadUser();
                        });
                    }
                },
            ],
            option: {
                root: context.config.root
            }
        });
        this.urlRouter.refresh();
    }
    context: typeDefinition.storeContext;
    listStore: typeDefinition.listStore;
    createStore: typeDefinition.createStore;
    roleStore: typeDefinition.roleStore;
    urlRouter: any;
    
    @observable isLoading = false;
    @observable mode = {
        name: "list",
        store: null
    };
    @observable currentUser = {};

    initialize(){
        return this.loadCurrentUser().then(() => this.urlRouter.refresh());
    }
    uninitialize(){
        this.urlRouter.historyUnlistener();
    }

    loadCurrentUser(){
        const config = this.context.config;
        return new Promise((resolve, reject) => {
            sa.get(config.apiPath.getCurrentUser)
                .set(config.headers)
                .end((err, res) => {
                    if(err){
                        return config.handle.resError(err, res).then((r) => {
                            toastr.error("Error", r.message);
                            return resolve();
                        });
                    }
                    else{
                        this.currentUser = res.body;
                        return resolve();
                    }
                });
        });
    }

    setPage(path){
        return this.urlRouter.changePath(path);
    }

    loading(callback){
        this.isLoading = true;
        callback(() => {
            this.isLoading = false;
        })
    }
};