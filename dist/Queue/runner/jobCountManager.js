'use strict';

var moment = require('moment');

var jobCountManager = function jobCountManager(_ref) {
    var workerLimit = _ref.workerLimit;

    var runningProcesses = {};
    var add = function add(uuid, job, promise) {
        return function (resolve, reject) {
            promise.then(function () {
                return new Promise(done(uuid, job));
            });
            promise.catch(function () {
                return new Promise(done(uuid, job));
            });
            var runningScriptProcess = runningProcesses[job.run_script] || (runningProcesses[job.run_script] = {});
            runningScriptProcess[uuid] = {
                at: moment.utc(),
                promise: promise
            };
            resolve();
        };
    };
    var done = function done(uuid, job) {
        return function (resolve, reject) {
            var runningScriptProcess = runningProcesses[job.run_script] || (runningProcesses[job.run_script] = {});
            delete runningScriptProcess[uuid];
            resolve();
        };
    };
    var isJobOverLimit = function isJobOverLimit(job) {
        return function (resolve, reject) {
            var runningScriptProcess = runningProcesses[job.run_script] || (runningProcesses[job.run_script] = {});
            var canRunJob = true;
            if (workerLimit && workerLimit[job.run_script]) {
                var limit = workerLimit[job.run_script];
                var runningCount = Object.keys(runningScriptProcess).length;
                if (limit.limit <= runningCount) {
                    canRunJob = false;
                }
            }
            resolve(canRunJob);
        };
    };
    return {
        add: add,
        done: done,
        isJobOverLimit: isJobOverLimit
    };
};
module.exports = jobCountManager;