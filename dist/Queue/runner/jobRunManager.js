"use strict";
var runJobScript = require('./runJobScript');
var insertToQueue = require('./insertToQueue');
var jobRunManager = function (context, jobCountManager, errorHandler) { return function (jobUuid, job) { return function (resolve, reject) {
    var logLevel = context.logLevel, workerLimit = context.workerLimit, log = context.log;
    return new Promise(jobCountManager.isJobOverLimit(job)).then(function (canRunJob) {
        if (canRunJob) {
            if (logLevel.start) {
                var startMessage = "START: " + job.run_script;
                if (job.key) {
                    startMessage = "START: " + job.run_script + " with key: " + job.key;
                }
                log.messageln(startMessage);
            }
            var servicePromise = new Promise(runJobScript({ workerLimit: workerLimit, log: log, logLevel: logLevel })(job))
                .then(resolve)
                .catch(function (err) {
                return new Promise(errorHandler(err, job, jobUuid)).then(resolve);
            });
            new Promise(jobCountManager.add(jobUuid, job, servicePromise));
            return servicePromise;
        }
        else {
            return new Promise(insertToQueue(context)(job))
                .then(function () {
                if (logLevel.workerLimit) {
                    log.messageln("WORKER LIMIT: " + job.run_script);
                }
                return resolve({
                    run: false,
                    code: "3",
                    message: "Worker limit reached"
                });
            });
        }
    });
}; }; };
module.exports = jobRunManager;
