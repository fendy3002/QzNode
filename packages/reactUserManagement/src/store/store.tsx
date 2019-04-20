let mobx = require('mobx');
const sa = require('superagent');
const toastr = require('toastr');
let {observable} = mobx;
let {listStore} = require('./listStore.tsx');
let {createStore} = require('./createStore.tsx');
let {roleStore} = require('./roleStore.tsx');
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
            'setPage',
            'initialize'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.listStore = new listStore(this);
        this.createStore = new createStore(this);
        this.roleStore = new roleStore(this);
        this.setPage();
    }
    context: typeDefinition.storeContext;
    listStore: typeDefinition.listStore;
    createStore: typeDefinition.createStore;
    roleStore: typeDefinition.roleStore;
    
    @observable isLoading = false;
    @observable page = "list";
    @observable currentUser = {};

    initialize(){
        return this.loadCurrentUser().then(() => {
            return this.listStore.loadUsers()
        });
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

    setPage(){
        let currentUrl = currentPath(this.context.config.root);
        const rolePattern = /\/(\w)\/role\//gi;
        if(currentUrl == "/"){ this.page = "list" }
        else if(currentUrl == "/create/"){ this.page = "create" }
        else if(rolePattern.test(currentUrl)){ this.page = "role" }
        else {
            this.page = "list";
        }
    }

    loading(callback){
        this.isLoading = true;
        callback(() => {
            this.isLoading = false;
        })
    }
};