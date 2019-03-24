const lo = require('lodash');
const mobx = require('mobx');
const path = require('path');
const sa = require('superagent');
const {observable, computed} = mobx;
const toastr = require('toastr');
const newFolderStore = require('./newFolderStore.tsx').newFolderStore;
import * as types from '../types';

export class store {
    constructor(context: types.context) {
        this.context = context;
        this.newFolderStore = new newFolderStore(this);
        [
            'loading',
            'initializeBrowse',
            'contentPath',
            'navigate',
            'selectFile',
            'clearSelection',
            'upload',
            'toggleNewFolder',
            'toggleUpload',
            'toggleDeleteFolder',
            'submitDeleteFolder'
        ].forEach((x) => {
            this[x] = this[x].bind(this);
        });
    }
    context : types.context;
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
    @computed get canDeleteFolder(){
        if(!this.currentPath || this.currentPath == "/"){
            return false;
        }
        else if(this.files.length > 0){
            return this.context.config.access.deleteFolder;
        } else{
            return this.context.config.access.deleteFolder || this.context.config.access.deleteEmptyFolder;
        }
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
        this.mode = "browse";
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
    toggleDeleteFolder(){
        if(this.mode != "deleteFolder"){
            this.mode = "deleteFolder";
        }
        else{
            this.mode = "browse";
        }
    }
    upload(acceptedFiles){
        const self = this;
        const config = self.context.config;
        let urlPath = path.join(config.apiPath.upload, this.currentPath);
        this.loading((done) => {
            const req = sa.post(urlPath)
                //.set('Content-Type', 'multipart/form-data')
                .set('Authorization', config.headers.authorization);
            req.field("overwrite", self.uploadOverwrite ? "true" : "");
            //req.attach("files", acceptedFiles);
            acceptedFiles.forEach(file => {
                req.attach(config.fieldName.upload.fileInput, file);
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
    submitDeleteFolder(){
        const self = this;
        const config = self.context.config;
        let urlPath = path.join(config.apiPath.delete, this.currentPath);
        const withContent = self.files.length > 0;
        this.loading((done) => {
            const req = sa.delete(urlPath)
                //.set('Content-Type', 'multipart/form-data')
                .set('Authorization', config.headers.authorization)
                .send({
                    [config.fieldName.delete.withContent]: withContent
                }).end((err, res) => {
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
                    toastr.success("Delete folder done");
                    done();
                    self.mode = "browse";
                    let fileParts = self.currentPath.split("/");
                    fileParts = fileParts.slice(0, fileParts.length - 1);
                    const navigateTo = path.join("/", fileParts.join("/"));
                    self.navigate(navigateTo);
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