var path = require("path");
var fs = require("fs");
var service = function (dirpath, ignore) {
    if (ignore === void 0) { ignore = ["index.js"]; }
    var load = function (obj, dirpath, prefixPath) {
        if (prefixPath === void 0) { prefixPath = ""; }
        fs.readdirSync(dirpath).forEach(function (file) {
            if (!prefixPath) {
                if (ignore.indexOf(file) > -1) {
                    return;
                }
            }
            else {
                if (ignore.indexOf(path.join(prefixPath, file)) > -1) {
                    return;
                }
            }
            var fullpath = path.join(dirpath, file);
            if (fs.lstatSync(fullpath).isDirectory()) {
                var subObj = {};
                obj[file] = subObj;
                load(subObj, fullpath, file);
            }
            else {
                var filename = file.replace(/\.[^/.]+$/, "");
                obj[filename] = require(fullpath);
            }
        });
    };
    var result = {};
    load(result, dirpath);
    return result;
};
module.exports = service;
