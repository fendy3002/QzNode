"use strict";
var dispatcher = require('./dispatcher');
var runner = require('./runner');
var Service = {
    dispatcher: dispatcher,
    runner: runner
};
module.exports = Service;
