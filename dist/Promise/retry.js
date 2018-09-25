"use strict";
var QzPromise = require('./QzPromise');
var retryService = function (callback, opt) {
    if (opt === void 0) { opt = { retry: 1 }; }
    return new QzPromise(function (resolve, reject) {
        var execute = function (retry) {
            if (retry === void 0) { retry = 0; }
            return new Promise(callback)
                .then(resolve)
                .catch(function (err) {
                if (retry < opt.retry) {
                    execute(retry + 1);
                }
                else {
                    reject(err);
                }
            });
        };
        execute(0);
    });
};
module.exports = retryService;
