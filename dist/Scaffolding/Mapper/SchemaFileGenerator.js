'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _SchemaClassGenerator = require('./SchemaClassGenerator.js');

var _SchemaClassGenerator2 = _interopRequireDefault(_SchemaClassGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SchemaFileGenerator = function SchemaFileGenerator(context) {
    return function (filepath) {
        return function (resolve, reject) {
            _fs2.default.readFile(filepath, function (err, data) {
                var schemaJson = JSON.parse(data);
            });
        };
    };
};

exports.default = SchemaFileGenerator;