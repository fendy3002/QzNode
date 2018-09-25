"use strict";
var fs = require('fs');
var lo = require('lodash');
var path = require('path');
var Service = function (_a) {
    var log = (_a === void 0 ? {} : _a).log;
    var qz = require('../../index');
    if (!log) {
        log = qz().logs.empty();
    }
    return function (pathArg, callback) { return function (resolve, reject) {
        var absolutePath = pathArg;
        if (!path.isAbsolute(pathArg)) {
            path.resolve(pathArg);
        }
        log.messageln("Processing for:" + absolutePath);
        var processPath = function (pathArg, tag) {
            return new Promise(function (resolve, reject) {
                fs.lstat(pathArg, function (err, stats) {
                    if (err) {
                        log.messageln(err);
                    }
                    else if (stats.isDirectory()) {
                        trace(pathArg, tag).then(function (result) {
                            resolve(result);
                        });
                    }
                    else {
                        resolve([{
                                tag: tag,
                                path: pathArg,
                                ext: path.extname(pathArg),
                                size: (stats.size / 1024).toFixed(2)
                            }]);
                    }
                });
            });
        };
        var trace = function (pathArg, tag) {
            return new Promise(function (resolve, reject) {
                var promises = [];
                fs.readdir(pathArg, function (err, files) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var filepath = path.join(pathArg, file);
                        var newTag = tag.concat([file]);
                        promises.push(processPath(filepath, newTag));
                    }
                    Promise.all(promises).then(function (result) {
                        resolve([].concat.apply([], result));
                    });
                });
            });
        };
        trace(absolutePath, []).then(function (result) {
            var size = lo.sumBy(result, function (obj) {
                return obj.size * 1;
            });
            resolve({
                size: size.toFixed(2),
                data: result
            });
        });
    }; };
};
module.exports = Service;
