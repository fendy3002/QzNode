"use strict";
var fs = require('fs');
var lo = require('lodash');
var Service = function (filepath, callback) {
    if (callback === void 0) { callback = function (err, message) { }; }
    var _ = {
        fs: fs,
        encoding: "utf8",
        done: function () { },
        pendings: []
    };
    var message = function (message) {
        onProcess(function (done) {
            _.fs.appendFile(filepath, message, _.encoding, function (err) {
                if (err) {
                    callback(err, message);
                }
                else {
                    callback(null, message);
                }
                done();
            });
        });
    };
    var messageln = function (msg) {
        message(msg + "\n");
    };
    var object = function (obj) {
        message(JSON.stringify(obj, null, 2) + "\n");
    };
    var exception = function (ex) {
        var msg = ex.toString() + "\n" + ex.stack;
        message(msg + "\n");
    };
    var onProcess = function (callback) {
        var process = { done: false };
        _.pendings.push(process);
        (function (process) {
            var onDone = function () {
                process.done = true;
                if (lo.filter(_.pendings, function (process) { return !process.done; }).length == 0) {
                    _.done();
                }
            };
            callback(onDone);
        })(process);
    };
    var onDone = function (cb) {
        _.done = cb;
        return lo.filter(_.pendings, function (process) { return !process.done; }).length == 0;
    };
    return {
        _: _,
        onDone: onDone,
        message: message,
        messageln: messageln,
        object: object,
        exception: exception
    };
};
module.exports = Service;
