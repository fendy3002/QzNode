import runJobScript from './runJobScript.js';
import insertToQueue from './insertToQueue.js';

let jobRunManager = (context, jobCountManager, errorHandler) => (jobUuid, job) => (resolve, reject) => {
    let {logLevel, workerLimit, log} = context;
    return new Promise(jobCountManager.isJobOverLimit(job)).then((canRunJob) => {
        if(canRunJob){
            if(logLevel.start){
                let startMessage = `START: ${job.run_script}`;
                if(job.key){
                    startMessage = `START: ${job.run_script} with key: ${job.key}`;
                }
                log.messageln(startMessage);
            }

            let servicePromise = new Promise(runJobScript({workerLimit, log, logLevel})(job))
                .then(resolve)
                .catch((err) => {
                    return new Promise(errorHandler(err, job, jobUuid)).then(resolve);
                });
            new Promise(jobCountManager.add(jobUuid, job, servicePromise));
            return servicePromise;
        }
        else{
            return new Promise(insertToQueue(context)(job))
            .then(() => {
                if(logLevel.workerLimit){
                    log.messageln(`WORKER LIMIT: ${job.run_script}`);
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

module.exports = jobRunManager;