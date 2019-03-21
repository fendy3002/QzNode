const lo = require('lodash');
const mobx = require('mobx');
const path = require('path');
const sa = require('superagent');
const {observable, computed} = mobx;
const toastr = require('toastr');
const newFolderStore = require('./newFolderStore.tsx');

export class store {
    constructor(context) {
        this.context = context;
        this.newFolderStore = new newFolderStore(this);

        this.loading = this.loading.bind(this);
        this.initializeBrowse = this.initializeBrowse.bind(this);
        this.contentPath = this.contentPath.bind(this);
        this.navigate = this.navigate.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.upload = this.upload.bind(this);
        this.toggleNewFolder = this.toggleNewFolder.bind(this);
        this.toggleUpload = this.toggleUpload.bind(this);
    }
    context;
    @observable isLoading = false;
    @observable files = [];
    @observable currentPath = "";
    @observable selected = "";
    @observable selectedFile = {};
    @observable uploadOverwrite = false;
    @observable mode = "browse";
    newFolderStore;

    selectAction = false;

    initializeBrowse(){
        const self = this;
        const browsePath = path.join(this.context.config.apiPath.browse, this.currentPath);
        this.selected = "";
        return new Promise((resolve, reject) => {
            self.loading(function(done){
                sa.get(browsePath)
                    .set('Authorization', self.context.config.headers.authorization)
                    .end(function(err, res) {
                        if(err){
                            if(res.status == "404")
                            toastr.error("Folder not found");
                        }
                        else{
                            self.files = res.body;
                        }
                        done();
                        resolve();
                    });
            })
        });
    }
    @computed get breadcrumb () {
        const filePathParts = this.currentPath.split("/").filter(k => k);
        let result = [];
        filePathParts.forEach((f, index) => {
            result.push(
                { 
                    label: f,
                    url: "/" + filePathParts.slice(0, index + 1).join("/"),
                    last: index == filePathParts.length - 1
                }
            );
        });
        return result;
    };
    navigate(newPath){
        if(newPath == "/"){
            newPath = "";
        }
        this.files = [];
        this.currentPath = newPath;
        return this.initializeBrowse();
    }
    selectFile(fileName){
        let selectedFiles = this.files.filter(f => f.name == fileName);
        if(selectedFiles && selectedFiles.length > 0){
            this.selected = fileName;
            this.selectAction = true;
            this.selectedFile = this.files.filter(f => f.name == fileName)[0];
        }
        else{
            this.selectAction = false;
        }
    }
    clearSelection(){
        if(this.selectAction){
            this.selectAction = false;
        }
        else{
            this.selected = "";
            this.selectedFile = {};
        }
    }

    fileInfoPath(fileName = ""){
        return path.join(this.context.config.apiPath.fileInfo, this.currentPath, fileName);
    }
    @computed get newfolderPath(){
        return path.join(this.context.config.apiPath.newFolder, this.currentPath);
    }
    contentPath(fileName = ""){
        return path.join(this.context.config.apiPath.content, this.currentPath, fileName);
    }
    toggleNewFolder(){
        if(this.mode != "newfolder"){
            this.mode = "newfolder";
        }
        else{
            this.mode = "browse";
        }
    }
    toggleUpload(){
        if(this.mode != "upload"){
            this.mode = "upload";
        }
        else{
            this.mode = "browse";
        }
    }
    upload(acceptedFiles){
        const self = this;
        let urlPath = path.join(this.context.config.apiPath.upload, this.currentPath);
        this.loading((done) => {
            const req = sa.post(urlPath)
                //.set('Content-Type', 'multipart/form-data')
                .set('Authorization', self.context.config.headers.authorization);
            req.field("overwrite", self.uploadOverwrite ? "true" : "");
            //req.attach("files", acceptedFiles);
            acceptedFiles.forEach(file => {
                req.attach("files", file);
            })
            req.end((err, res) => {
                if(err){
                    if(res.body.message){
                        toastr.error(res.body.message);
                    }
                    else{
                        toastr.error(res.body.toString());
                    }
                    done();
                }
                else{
                    toastr.success("Upload done");
                    done();
                    self.mode = "browse";
                    self.initializeBrowse();
                }
            });
        });
    }

    loading(callback){
        this.isLoading = true;
        callback(() => {
            this.isLoading = false;
        })
    }
};