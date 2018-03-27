
let getScriptPromise = (
    {workerLimit, log, logLevel}, 
    job) => {
    
    let scriptToRun = require(job.run_script);
    if(!scriptToRun){
        if(logLevel.scriptNotFound){
            log.messageln(`ERROR: ${job.run_script} NOT FOUND`);
        }
        return Promise.resolve({
            run: false,
            code: "2",
            message: "Script not found"
        });
    }
    let scriptPromise = new Promise(scriptToRun(JSON.parse(job.params)));
    if(workerLimit[job.run_script] && workerLimit[job.run_script].timeout){
        console.log("timeout", workerLimit[job.run_script].timeout);
        let timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject({
                    run: false,
                    code: "4",
                    message: "Script timeout"
                });
            }, workerLimit[job.run_script].timeout);
        });
        return Promise.race([scriptPromise, timeoutPromise]);
    }
    else{
        return scriptPromise;
    }
};
export default getScriptPromise;