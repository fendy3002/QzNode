"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var SchemaFileGenerator = function (context) { return function (filepath) { return function (resolve, reject) {
    fs_1.default.readFile(filepath, function (err, data) {
        var schemaJson = JSON.parse(data);
    });
}; }; };
exports.default = SchemaFileGenerator;
