"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteFolderRecursive = function deleteFolderRecursive(path) {
    if (_fs2.default.existsSync(path)) {
        _fs2.default.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (_fs2.default.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                _fs2.default.unlinkSync(curPath);
            }
        });
        _fs2.default.rmdirSync(path);
    }
};

exports.default = deleteFolderRecursive;