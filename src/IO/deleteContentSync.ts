import * as qz from '../types';
const fs = require("fs");
const paths = require("path");

let deleteContentSync: qz.IO.DeleteContentSync = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            let curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteContentSync(curPath);
                fs.rmdirSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
};

export = deleteContentSync;