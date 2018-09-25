"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var GeneratorService = function (context) { return function () {
    var rootPath = context.rootPath, config = context.config, log = context.log;
    var schemaFolder = path_1.default.join(rootPath, config.schema);
    var converterFolder = path_1.default.join(rootPath, config.converter);
    log.messageLn("START:\t generate schema from schema in folder: " + schemaFolder);
    var schemaList = [];
    var passConfig = __assign({ "dateFormat": "YYYY-MM-DD", "dateTimeFormat": "YYYYY-MM-DD H:m:s" }, config);
    new Promise(function (resolve, reject) {
        fs_1.default.readdir(schemaFolder, function (err, files) {
            resolve(files);
        });
    }).then(function (files) {
    });
}; };
exports.default = GeneratorService;
