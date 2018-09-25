'use strict';

var fs = require('fs');
var commandLineArgs = require('command-line-args');
var reader = require('./reader/index.js');
var readerOutput = require('./reader/output.js');
var qz = require('../index.js');

var optionDefinitions = [{ name: 'path', type: String, alias: 'p', multiple: false, defaultOption: true }, { name: 'pretty', type: Boolean, multiple: false }, { name: 'out', type: String, alias: 'o', multiple: false }, { name: 'log', type: String, multiple: false }];
var options = commandLineArgs(optionDefinitions);

if (!options.path) {
    console.log("Usage: node exec.js <path-to-list>");
} else {
    var path = options.path;
    var log = null;
    if (options.log) {
        log = qz().logs.file(options.log);
    } else {
        log = qz().logs.console();
    }
    new Promise(reader({
        log: log
    })(path)).then(function (result) {
        readerOutput(options)(result, function (err) {
            if (err) {
                log.messageln(err);
            }
        });
    });
}