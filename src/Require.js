var path = require("path");
var fs = require("fs");

var service = (dirpath, ignore = ["index.js"]) => {
    var load = (obj, dirpath) => {
        fs.readdirSync(dirpath).forEach(function(file) {
            if(ignore.indexOf(file) > -1){ return; }
            let fullpath = path.join(dirpath, file);
            if(fs.lstatSync(fullpath).isDirectory()){
                var subObj = {};
                obj[file] = subObj;
                load(subObj, fullpath);
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