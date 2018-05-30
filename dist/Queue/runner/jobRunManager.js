'use strict';

var _runJobScript = require('./runJobScript.js');

var _runJobScript2 = _interopRequireDefault(_runJobScript);

var _insertToQueue = require('./insertToQueue.js');

var _insertToQueue2 = _interopRequireDefault(_insertToQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jobRunManager = function jobRunManager(context, jobCountManager, errorHandler) {
    return function (jobUuid, job) {
        return function (resolve, reject) {
            var logLevel = context.logLevel,
                workerLimit = context.workerLimit,
                log = context.log;

            return new Promise(jobCountManager.isJobOverLimit(job)).then(function (canRunJob) {
                if (canRunJob) {
                    if (logLevel.start) {
                        var startMessage = 'START: ' + job.run_script;
                        if (job.key) {
                            startMessage = 'START: ' + job.run_script + ' with key: ' + job.key;
                        }
                        log.messageln(startMessage);
                    }

                    var servicePromise = new Promise((0, _runJobScript2.default)({ workerLimit: workerLimit, log: log, logLevel: logLevel })(job)).then(resolve).catch(function (err) {
                        return new Promise(errorHandler(err, job, jobUuid)).then(resolve);
                    });
                    new Promise(jobCountManager.add(jobUuid, job, servicePromise));
                    return servicePromise;
                } else {
                    return new Promise((0, _insertToQueue2.default)(context)(job)).then(function () {
                        if (logLevel.workerLimit) {
                            log.messageln('WORKER LIMIT: ' + job.run_script);
                        }
                        return resolve({
                            run: false,
                            code: "3",
                            message: "Worker limit reached"
                        });
                    });
                }
            });
        };
    };
};

module.exports = jobRunManager;