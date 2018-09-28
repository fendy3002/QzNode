"use strict";
var deleteContentSync = require("./deleteContentSync");
var mkdirRecursive = require("./mkdirRecursive");
var Service = {
    deleteContentSync: deleteContentSync,
    mkdirRecursive: mkdirRecursive
};
module.exports = Service;
