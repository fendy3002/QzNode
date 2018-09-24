"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QzPromise = require('./QzPromise');
var limit = require('./limit');
var retry = require('./retry');
var Service = function (callback) {
    return new QzPromise(callback);
};
Service.limit = limit;
Service.retry = retry;
module.exports = Service;
