import * as thisTypes from './types';
interface RunnerParam {
    driver: string;
    connection: thisTypes.Connection;
    tableName: string;
    runningTableName: string;
    failedTableName: string;
    tag: string;
    retry: number;
    log: any;
    workerLimit: any;
    logLevel: thisTypes.LogLevel;
}
declare let runner: (param: RunnerParam) => {
    once: () => Promise<{}>;
    listen: ({ interval }: {
        interval?: number;
    }) => void;
};
export = runner;
