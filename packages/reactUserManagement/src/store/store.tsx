let mobx = require('mobx');
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

    initialize(){
        return this.listStore.loadUsers();
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