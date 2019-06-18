let mobx = require('mobx');
const toastr = require('toastr');
const sa = require('superagent');
let {observable, computed} = mobx;
import * as typeDefinition from './typeDefinition';

export class listStore implements typeDefinition.listStore {
    constructor(originalStore){
        this.store = originalStore;
        [
            'changeSuperAdmin',
            'changeActive',
            'changeEmail',
            'resetPassword',
            'resendConfirmation',
            'setPage',
            'loadUsers'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    store: typeDefinition.store;
    @observable users = [];
    @observable userCount = 0;

    page(){
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get("page")) || 1;
    }
    limit(){
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get("limit")) || 20;
    }

    resetPassword(userid){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.resetPassword.replace(/\{id\}/gi, userid))
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
                            toastr.success(res.body.message, "Success");
                            return self.loadUsers().then(resolve).catch(reject);
                        }
                    });
            });
        });
    }
    resendConfirmation(userid){
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                sa.post(config.apiPath.resendConfirmation.replace(/\{id\}/gi, userid))
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
                            toastr.success(res.body.message, "Success");
                            return self.loadUsers().then(resolve).catch(reject);
                        }
                    });
            });
        });
    }
    
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
                                toastr.error(r.message, "Error");
                                return resolve();
                            });
                        }
                        else{
                            toastr.success(res.body.message, "Success");
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
                                toastr.error(r.message, "Error");
                                return resolve();
                            });
                        }
                        else{
                            toastr.success(res.body.message, "Success");
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
                    .send({
                        email: newEmail
                    })
                    .set(config.headers)
                    .end((err, res) => {
                        done();
                        if(err){
                            return config.handle.resError(err, res).then((r) => {
                                toastr.error(r.message, "Error");
                                return resolve();
                            })
                        }
                        else{
                            toastr.success(res.body.message, "Success");
                            return self.loadUsers().then(resolve).catch(reject);
                        }
                    });
            });
        })
    }
    setPage(page){
        return this.store.urlRouter.changeQueryParam({ page: page });
    }
    setLimit(limit){
        return this.store.urlRouter.changeQueryParam({ limit: limit });
    }

    loadUsers() {
        const self = this;
        const config = this.store.context.config;

        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get("page") || 1;
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
                            self.users = res.body;
                            self.userCount = parseInt(res.headers["x-total-count"]);
                            return resolve();
                        }
                    });
            });
        });
    }
};