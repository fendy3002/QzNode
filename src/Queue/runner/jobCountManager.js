import moment from 'moment';

let jobCountManager = ({
    workerLimit
}) => {
    let runningProcesses = {};
    let add = (uuid, job, promise) => (resolve, reject) => {
        promise.then(() => {
            return new Promise(done(uuid, job));
        });
        promise.catch(() => {
            return new Promise(done(uuid, job));
        });
        let runningScriptProcess = runningProcesses[job.run_script] || (runningProcesses[job.run_script] = {});
        runningScriptProcess[uuid] = {
            at: moment.utc(),
            promise: promise
        };
        resolve();
    };
    let done = (uuid, job) => (resolve, reject) => {
        let runningScriptProcess = runningProcesses[job.run_script] || (runningProcesses[job.run_script] = {});
        delete runningScriptProcess[uuid];
        resolve();
    };
    let isJobOverLimit = (job) => (resolve, reject) => {
        let runningScriptProcess = runningProcesses[job.run_script] || 
        (runningProcesses[job.run_script] = {});
        let canRunJob = true;
        if(workerLimit && workerLimit[job.run_script]){
            let limit = workerLimit[job.run_script];
            let runningCount = Object.keys(runningScriptProcess).length;
            if(limit.limit <= runningCount){
                canRunJob = false;
            }
        }
        resolve(canRunJob);
    };
    return {
        add,
        done,
        isJobOverLimit
    };
};
export default jobCountManager;