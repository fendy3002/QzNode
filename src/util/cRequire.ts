const path = require("path");
const fs = require("fs");
const debug = require('debug')('qz-node:require');

export const cRequire = (dirpath: string, ignore: string[] = ["index.js"]) : object => {
    let load = (obj: object, dirpath: string, prefixPath: string = "") => {
        debug("begin require on path: " + dirpath + ", prefix: " + prefixPath);
        fs.readdirSync(dirpath).forEach(function(file) {
            if(!prefixPath){
                if(ignore.indexOf(file) > -1){ return; }
            }
            else{
                if(ignore.indexOf(path.join(prefixPath, file)) > -1){ return; }
            }
            let fullpath: string = path.join(dirpath, file);
            if(fs.lstatSync(fullpath).isDirectory()){
                let subObj = {};
                obj[file] = subObj;
                load(subObj, fullpath, file);
            }
            else{
                let filename = file.replace(/\.[^/.]+$/, "");
                obj[filename] = require(fullpath);
            }
        });
    };
    let result:object = {};
    debug("begin require");
    load(result, dirpath);
    debug("end require");
    return result;
};