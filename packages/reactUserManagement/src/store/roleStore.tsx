let mobx = require('mobx');
const toastr = require('toastr');
const sa = require('superagent');
let {observable, computed} = mobx;
import * as typeDefinition from './typeDefinition';

export class roleStore implements typeDefinition.roleStore {
    constructor(originalStore){
        this.store = originalStore;
        [
            'submit'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    store: typeDefinition.store;

    submit(){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.register)
                .then((err, res) => {
                    done();

                    resolve();
                });
            });
        })
    }
};