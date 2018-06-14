'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        log = _ref.log;

    if (!log) {
        log = (0, _index2.default)().logs.empty();
    }
    return function (pathArg, callback) {
        return function (resolve, reject) {
            var absolutePath = pathArg;
            if (!_path2.default.isAbsolute(pathArg)) {
                _path2.default.resolve(pathArg);
            }

            log.messageln("Processing for:" + absolutePath);

            var processPath = function processPath(pathArg, tag) {
                return new Promise(function (resolve, reject) {
                    _fs2.default.lstat(pathArg, function (err, stats) {
                        if (err) {
                            log.messageln(err);
                        } else if (stats.isDirectory()) {
                            trace(pathArg, tag).then(function (result) {
                                resolve(result);
                            });
                        } else {
                            resolve([{
                                tag: tag,
                                path: pathArg,
                                ext: _path2.default.extname(pathArg),
                                size: (stats.size / 1024).toFixed(2)
                            }]);
                        }
                    });
                });
            };

            var trace = function trace(pathArg, tag) {
                return new Promise(function (resolve, reject) {
                    var promises = [];
                    _fs2.default.readdir(pathArg, function (err, files) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            var filepath = _path2.default.join(pathArg, file);
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
                var size = _lodash2.default.sumBy(result, function (obj) {
                    return obj.size * 1;
                });

                resolve({
                    size: size.toFixed(2),
                    data: result
                });
            });
        };
    };
};

exports.default = Service;