"use strict";
var path = require('path');
var fs = require('fs');
// https://stackoverflow.com/a/40686853/2155396
var mkdirRecursive = function (targetDir, option) {
    var isRelativeToScript = false;
    if (option) {
        isRelativeToScript = option.isRelativeToScript;
    }
    var sep = path.sep;
    var initDir = path.isAbsolute(targetDir) ? sep : '';
    var baseDir = isRelativeToScript ? __dirname : '.';
    return targetDir.split(sep).reduce(function (parentDir, childDir) {
        var curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        }
        catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                return curDir;
            }
            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error("EACCES: permission denied, mkdir '" + parentDir + "'");
            }
            var caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && targetDir === curDir) {
                throw err; // Throw if it's just the last created dir.
            }
        }
        return curDir;
    }, initDir);
};
module.exports = mkdirRecursive;
