declare let queueRetrieve: ({ openDb, tableName, runningTableName, tag, log, logLevel, retry }: {
    openDb: any;
    tableName: any;
    runningTableName: any;
    tag: any;
    log: any;
    logLevel: any;
    retry: any;
}) => (jobUuid: any) => (resolve: any, reject: any) => void;
export = queueRetrieve;
