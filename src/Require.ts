const path = require("path");
const fs = require("fs");

let service = (dirpath: string, ignore: string[] = ["index.js"]) : object => {
    let load = (obj: object, dirpath: string, prefixPath: string = "") => {
        fs.readdirSync(dirpath).forEach(function(file) {
            if(!prefixPath){
                if(ignore.indexOf(file) > -1){ return; }
            }
            else{
                if(ignore.indexOf(path.join(prefixPath, file)) > -1){ return; }
            }
            let fullpath: string = path.join(dirpath, file);
            if(fs.lstatSync(fullpath).isDirectory()){
                var subObj = {};
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
    load(result, dirpath);
    return result;
}

export = service;