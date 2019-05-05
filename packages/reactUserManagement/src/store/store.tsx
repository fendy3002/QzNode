let mobx = require('mobx');
const sa = require('superagent');
const toastr = require('toastr');
let {observable} = mobx;
let {listStore} = require('./listStore.tsx');
let {createStore} = require('./createStore.tsx');
let {roleStore} = require('./roleStore.tsx');
const { createBrowserHistory } = require('history');

import * as typeDefinition from './typeDefinition';

const currentPath = (root) => {
    let currentUrl = window.location.pathname;
    root = ("/" + root + "/").replace(/\/\//gi, "/");
    currentUrl = ("/" + currentUrl + "/").replace(/\/\//gi, "/");

    return ("/" + currentUrl.replace(root, "") + "/").replace(/\/\//gi, "/");
}

export class store implements typeDefinition.store {
    constructor(context) {
        this.context = context;
        [
            'loading',
            'detectPage',
            'initialize',
            'uninitialize',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.listStore = new listStore(this);
        this.createStore = new createStore(this);
        this.roleStore = new roleStore(this);
        this.detectPage();
    }
    context: typeDefinition.storeContext;
    listStore: typeDefinition.listStore;
    createStore: typeDefinition.createStore;
    roleStore: typeDefinition.roleStore;
    
    history = null;
    historyUnlistener = null;

    @observable isLoading = false;
    @observable page = "list";
    @observable currentUser = {};

    initialize(){
        this.history = createBrowserHistory({
            basename: this.context.config.root
        });
        this.historyUnlistener = this.history.listen((location, action) => {
            this.detectPage();
        });
        return this.loadCurrentUser();
    }
    uninitialize(){
        this.historyUnlistener();
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

    detectPage(){
        let currentUrl = currentPath(this.context.config.root);
        const rolePattern = /\/(\w)\/role\//gi;
        if(currentUrl == "/"){ 
            this.page = "list";
            return this.listStore.loadUsers();
        }
        else if(currentUrl == "/create/"){ this.page = "create" }
        else if(rolePattern.test(currentUrl)){
            const matchPattern = /\/(\w)\/role\//gi;
            let match = matchPattern.exec(currentUrl);
            this.page = "role";
            this.roleStore.userId = match[1];
            this.roleStore.selectedRoles = [];
            return this.roleStore.loadRoles().then(() => {
                return this.roleStore.loadUser();
            });
        }
        else {
            this.page = "list";
            return this.listStore.loadUsers();
        }
    }
    setPage(path){
        const urlParams = new URLSearchParams(window.location.search);

        const redirectTo = (this.context.config.root + "/" + path).replace(/\/\//gi, "/");
        window.history.pushState({}, '', redirectTo + '?' + urlParams);
        return this.detectPage();
    }

    loading(callback){
        this.isLoading = true;
        callback(() => {
            this.isLoading = false;
        })
    }
};