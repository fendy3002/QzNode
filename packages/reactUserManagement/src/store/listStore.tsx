let mobx = require('mobx');
const toastr = require('toastr');
const sa = require('superagent');
let {observable} = mobx;
import * as typeDefinition from './typeDefinition';

export class listStore implements typeDefinition.listStore {
    constructor(originalStore){
        this.store = originalStore;
        [
            'changeSuperAdmin',
            'changeActive',
            'changeEmail',
            'setPage',
            'loadUsers'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    store: typeDefinition.store;
    @observable users = [];

    changeSuperAdmin(userid, isSuperAdmin){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.changeSuperAdmin.replace(/\{id\}/gi, userid))
                    .set(config.headers)
                    .send({
                        is_super_admin: isSuperAdmin
                    })
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error("Error", r.message);
                                return resolve();
                            })
                        }
                        else{
                            toastr.success("Super admin changed successfully");
                            return self.loadUsers().then(resolve).catch(reject);
                        }
                    });
            });
        })
    }

    changeActive(userid, isActive){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.changeActive.replace(/\{id\}/gi, userid))
                    .set(config.headers)
                    .send({
                        is_active: isActive
                    })
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error("Error", r.message);
                                return resolve();
                            })
                        }
                        else{
                            toastr.success("Active changed successfully");
                            return self.loadUsers().then(resolve).catch(reject);
                        }
                    });
            });
        })
    }

    changeEmail(userid, newEmail){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.changeEmail.replace(/\{id\}/gi, userid))
                    .set(config.headers)
                    .send({
                        email: newEmail
                    })
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error("Error", r.message);
                                return resolve();
                            })
                        }
                        else{
                            toastr.success("Email changed successfully");
                            return self.loadUsers().then(resolve).catch(reject);
                        }
                    });
            });
        })
    }
    setPage(page){
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("page", page);
        return this.loadUsers();
    }

    loadUsers() {
        const self = this;
        const config = this.store.context.config;

        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get("page") || 0;
        const limit = urlParams.get("limit") || 20;

        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                self.users.length = 0;
                sa.get(config.apiPath.getUsers)
                    .set(config.headers)
                    .query({
                        page: page,
                        limit: limit
                    })
                    .set(config.headers)
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error("Error", r.message);
                                return resolve();
                            });
                        }
                        else{
                            self.users = res.body;
                            return resolve();
                        }
                    });
            });
        });
    }
};