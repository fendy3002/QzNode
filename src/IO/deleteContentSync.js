let fs = require("fs");
let paths = require("path");

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                fs.rmdirSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
};

module.exports = deleteFolderRecursive;