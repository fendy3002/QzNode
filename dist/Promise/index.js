"use strict";
var QzPromise = require('./QzPromise');
var limit = require('./limit');
var retry = require('./retry');
var Service = function (callback) {
    return new QzPromise(callback);
};
Service.limit = limit;
Service.retry = retry;
module.exports = Service;
