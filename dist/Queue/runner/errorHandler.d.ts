declare let errorHandler: ({ openDb, tableName, runningTableName, retry, log, logLevel }: {
    openDb: any;
    tableName: any;
    runningTableName: any;
    retry: any;
    log: any;
    logLevel: any;
}) => (err: any, job: any, runUuid: any) => (resolve: any, reject: any) => void;
export = errorHandler;
