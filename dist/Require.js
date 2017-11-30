"use strict";

var path = require("path");
var fs = require("fs");

var service = function service(dirpath) {
    var ignore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["index.js"];

    var load = function load(obj, dirpath) {
        fs.readdirSync(dirpath).forEach(function (file) {
            if (ignore.indexOf(file) > -1) {
                return;
            }
            var fullpath = path.join(dirpath, file);
            if (fs.lstatSync(fullpath).isDirectory()) {
                var subObj = {};
                obj[file] = subObj;
                load(subObj, fullpath);
            } else {
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