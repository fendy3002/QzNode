"use strict";
var runJobScript = function (_a) {
    var workerLimit = _a.workerLimit, log = _a.log, logLevel = _a.logLevel;
    return function (job) { return function (resolve, reject) {
        var scriptToRun = require(job.run_script);
        if (!scriptToRun) {
            if (logLevel.scriptNotFound) {
                log.messageln("ERROR: " + job.run_script + " NOT FOUND");
            }
            return reject({
                run: false,
                code: "2",
                message: "Script not found"
            });
        }
        var scriptPromise = new Promise(scriptToRun(JSON.parse(job.params))).catch(reject);
        var onDone = function (result) {
            if (logLevel.done) {
                var doneMessage = "DONE: " + job.run_script;
                if (job.key) {
                    doneMessage = "DONE: " + job.run_script + " with key: " + job.key;
                }
                log.messageln(doneMessage);
            }
            return resolve({
                run: true,
                data: result
            });
        };
        if (workerLimit[job.run_script] && workerLimit[job.run_script].timeout) {
            var timeoutPromise = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject({
                        run: false,
                        code: "4",
                        message: "Script timeout"
                    });
                }, workerLimit[job.run_script].timeout);
            }).catch(reject);
            return Promise.race([scriptPromise, timeoutPromise]).then(onDone);
        }
        else {
            return scriptPromise.then(onDone);
        }
    }; };
};
module.exports = runJobScript;
