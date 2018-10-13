"use strict";
var fs = require("fs");
var paths = require("path");
var deleteContentSync = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteContentSync(curPath);
                fs.rmdirSync(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
};
module.exports = deleteContentSync;
