let mobx = require('mobx');
const toastr = require('toastr');
const sa = require('superagent');
let {observable} = mobx;
import * as typeDefinition from './typeDefinition';

export class listStore implements typeDefinition.listStore {
    constructor(originalStore){
        this.store = originalStore;
        this.changeEmail = this.changeEmail.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
    }
    store: typeDefinition.store;
    @observable users = [];

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
};