declare let runJobScript: ({ workerLimit, log, logLevel }: {
    workerLimit: any;
    log: any;
    logLevel: any;
}) => (job: any) => (resolve: any, reject: any) => any;
export = runJobScript;
