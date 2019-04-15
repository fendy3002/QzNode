let mobx = require('mobx');
let {observable} = mobx;
import * as typeDefinition from './typeDefinition';

export class store implements typeDefinition.store {
    constructor(context) {
        this.context = context;
        this.loading = this.loading.bind(this);
        this.setPage = this.setPage.bind(this);
    }
    context: typeDefinition.storeContext;
    @observable isLoading = false;
    @observable page = "list";
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