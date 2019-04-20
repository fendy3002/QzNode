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
        this.user = {
            ...this.user,
            ...user
        };
    }

    submit(){
        const self = this;
        const config = this.store.context.config;
        if(!this.user.email || !this.user.name || !this.user.username){
            toastr.error("Username, name and email are required", "Input");
            return Promise.resolve();
        }
        else if(confirm("Are you sure to submit?")){
            return new Promise((resolve, reject) => {
                this.store.loading((done) => {
                    sa.put(config.apiPath.register)
                    .send(this.user)
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error(r.message, "Error");
                                return resolve();
                            });
                        }
                        else{
                            toastr.success(res.body.message, "Success");
                            self.user = self.defaultUser;
                            resolve();
                        }
                    });
                });
            })
        }
    }
};