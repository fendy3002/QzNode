const lo = require('lodash');
const mobx = require('mobx');
const path = require('path');
const sa = require('superagent');
const toastr = require('toastr');
const {observable, computed} = mobx;

export class newFolderStore {
    constructor(originalStore){
        this.store = originalStore;
        this.changeNewFolderName = this.changeNewFolderName.bind(this);
        this.submit = this.submit.bind(this);
    }
    store;
    @observable newFolderName = "";
    @computed get existingPath(){
        const pathParts = this.store.currentPath.split("/").filter(k => k);
        return "/" + pathParts.join("/") + "/";
    }

    changeNewFolderName(newName){
        this.newFolderName = newName;
    }
    submit(){
        const self = this;
        const config = self.store.context.config;
        const apiPath = path.join(config.apiPath.newFolder, 
            self.store.currentPath);
        self.store.loading((done) => {
            sa.post(apiPath)
                .set('Authorization', config.headers.authorization)
                .send({
                    [config.fieldName.newFolder.folderNameInput]: this.newFolderName
                })
                .end((err, res) => {
                    done();
                    if(err){
                        toastr.error(res.body.message);
                    }
                    else{
                        self.newFolderName = "";
                        self.store.navigate(res.body.newPath).then(() => {
                            self.store.mode = "browse";
                        });
                    }
                });
        })
    }
};