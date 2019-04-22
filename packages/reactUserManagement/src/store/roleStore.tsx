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

    @observable roles = [];
    @observable user;
    @observable userId;

    loadRoles(){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.get(config.apiPath.getRoles)
                    .query({
                        page: 0,
                        limit: Number.MAX_SAFE_INTEGER
                    })
                    .set(config.headers)
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error(r.message, "Error");
                                return resolve();
                            });
                        }
                        else if(!res.headers["x-total-count"] && res.headers["x-total-count"] != 0){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error('X-Total-Count header is required in response.', "Error");
                                return resolve();
                            });
                        }
                        else{
                            self.roles = res.body;
                            return resolve();
                        }
                    });
            });
        });
    }

    loadUser(){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.get(config.apiPath.getUser.replace("{id}", self.userId))
                    .set(config.headers)
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error(r.message, "Error");
                                return resolve();
                            });
                        }
                        else{
                            self.user = res.body;
                            return resolve();
                        }
                    });
            });
        });
    }

    submit(){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.register)
                    .set(config.headers)
                    .end((err, res) => {
                        done();

                        resolve();
                    });
            });
        })
    }
};