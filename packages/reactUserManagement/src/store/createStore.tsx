let mobx = require('mobx');
const toastr = require('toastr');
const sa = require('superagent');
let {observable, computed} = mobx;
import * as typeDefinition from './typeDefinition';

export class createStore implements typeDefinition.createStore {
    constructor(originalStore){
        this.store = originalStore;
        [
            'submit',
            'changeUser'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.user = this.defaultUser;
    }
    store: typeDefinition.store;
    defaultUser = {
        name: "",
        username: "",
        email: ""
    }
    @observable user = {
        name: "",
        username: "",
        email: ""
    };

    changeUser(user){
        this.user = user;
    }

    submit(){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.register)
                .send(this.user)
                .then((err, res) => {
                    done();

                    self.user = self.defaultUser;
                    resolve();
                });
            });
        })
    }
};