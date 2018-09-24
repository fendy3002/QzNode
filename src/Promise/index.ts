export {};

let QzPromise = require('./QzPromise');
let limit = require('./limit');
let retry = require('./retry');

var Service:any = function(callback) {
    return new QzPromise(callback);
};

Service.limit = limit;
Service.retry = retry;

module.exports = Service;