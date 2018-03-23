'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                at: _moment2.default.utc(),
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
exports.default = jobCountManager;