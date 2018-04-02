var path = require("path");
var fs = require("fs");

var service = (dirpath, ignore = ["index.js"]) => {
    var load = (obj, dirpath, prefixPath = "") => {
        fs.readdirSync(dirpath).forEach(function(file) {
            if(!prefixPath){
                if(ignore.indexOf(file) > -1){ return; }
            }
            else{
                if(ignore.indexOf(path.join(prefixPath, file)) > -1){ return; }
            }
            let fullpath = path.join(dirpath, file);
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
    let result = {};
    load(result, dirpath);
    return result;
}

module.exports = service;