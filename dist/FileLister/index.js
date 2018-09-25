"use strict";
var reader = require('./reader/index');
var readerOutput = require('./reader/output');
var Service = function () { return ({
    reader: reader,
    readerOutput: readerOutput
}); };
module.exports = Service;
