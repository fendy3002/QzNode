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

    loadUsers() {
        const self = this;
        const config = this.store.context.config;
        return new Promise((resolve, reject) => {
            this.store.loading((done) => {
                self.users.length = 0;
                sa.get(config.apiPath.getUsers)
                    .set(config.headers)
                    .end((err, res) => {
                        self.users = res.body;
                        done();
                        resolve();
                    });
            });
        });
    }
    changeEmail(userid, newEmail){
        const self = this;
        const config = this.store.context.config;
        this.store.loading((done) => {
            sa.post(config.apiPath.changeEmail.replace(/\{id\}/gi, userid))
            .set(config.headers)
            .send({
                email: newEmail
            })
            .end((err, res) => {
                if(err){ 
                    toastr.error(res.body.message);
                }
                else{ 
                    toastr.success("Email changed successfully");
                }
                done();
                return self.loadUsers();
            });
        });
    }
};