'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GeneratorService = function GeneratorService(context) {
    return function () {
        var rootPath = context.rootPath,
            config = context.config,
            log = context.log;

        var schemaFolder = _path2.default.join(rootPath, config.schema);
        var converterFolder = _path2.default.join(rootPath, config.converter);
        log.messageLn("START:\t generate schema from schema in folder: " + schemaFolder);

        var schemaList = [];
        var passConfig = (0, _extends3.default)({
            "dateFormat": "YYYY-MM-DD",
            "dateTimeFormat": "YYYYY-MM-DD H:m:s"
        }, config);

        new Promise(function (resolve, reject) {
            _fs2.default.readdir(schemaFolder, function (err, files) {
                resolve(files);
            });
        }).then(function (files) {});
    };
};

exports.default = GeneratorService;