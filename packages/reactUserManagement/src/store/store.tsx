let mobx = require('mobx');
const sa = require('superagent');
const toastr = require('toastr');
let {observable} = mobx;
let {listStore} = require('./listStore.tsx');
import * as typeDefinition from './typeDefinition';

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
    }
    context: typeDefinition.storeContext;
    listStore: typeDefinition.listStore;

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

    setPage(page){
        this.page = page;
    }

    loading(callback){
        this.isLoading = true;
        callback(() => {
            this.isLoading = false;
        })
    }
};