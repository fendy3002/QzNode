"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var getScriptPromise = function getScriptPromise(_ref, job) {
    var workerLimit = _ref.workerLimit,
        log = _ref.log,
        logLevel = _ref.logLevel;


    var scriptToRun = require(job.run_script);
    if (!scriptToRun) {
        if (logLevel.scriptNotFound) {
            log.messageln("ERROR: " + job.run_script + " NOT FOUND");
        }
        return Promise.reject({
            run: false,
            code: "2",
            message: "Script not found"
        });
    }
    var scriptPromise = new Promise(scriptToRun(JSON.parse(job.params)));
    if (workerLimit[job.run_script] && workerLimit[job.run_script].timeout) {
        var timeoutPromise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject({
                    run: false,
                    code: "4",
                    message: "Script timeout"
                });
            }, workerLimit[job.run_script].timeout);
        });
        return Promise.race([scriptPromise, timeoutPromise]);
    } else {
        return scriptPromise;
    }
};
exports.default = getScriptPromise;