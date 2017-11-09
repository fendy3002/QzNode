import fs from "fs";
import paths from "path";

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                fs.rmdirSync(path);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
};

export default deleteFolderRecursive;