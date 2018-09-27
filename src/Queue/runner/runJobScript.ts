
let runJobScript = ({workerLimit, log, logLevel}) => (job) => (resolve, reject) => {
    let scriptToRun = require(job.run_script);
    if(!scriptToRun){
        if(logLevel.scriptNotFound){
            log.messageln(`ERROR: ${job.run_script} NOT FOUND`);
        }
        return reject({
            run: false,
            code: "2",
            message: "Script not found"
        });
    }
    let scriptPromise = new Promise(scriptToRun(JSON.parse(job.params))).catch(reject);
    let onDone = (result) => {
        if(logLevel.done){
            let doneMessage = `DONE: ${job.run_script}`;
            if(job.key){
                doneMessage = `DONE: ${job.run_script} with key: ${job.key}`;
            }
            log.messageln(doneMessage);
        }
        return resolve({
            run: true,
            data: result
        });
    };
    if(workerLimit[job.run_script] && workerLimit[job.run_script].timeout){
        let timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject({
                    run: false,
                    code: "4",
                    message: "Script timeout"
                });
            }, workerLimit[job.run_script].timeout);
        }).catch(reject);
        return Promise.race([scriptPromise, timeoutPromise]).then(onDone);
    }
    else{
        return scriptPromise.then(onDone);
    }
};
export = runJobScript;