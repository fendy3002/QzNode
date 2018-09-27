declare let jobCountManager: ({ workerLimit }: {
    workerLimit: any;
}) => {
    add: (uuid: any, job: any, promise: any) => (resolve: any, reject: any) => void;
    done: (uuid: any, job: any) => (resolve: any, reject: any) => void;
    isJobOverLimit: (job: any) => (resolve: any, reject: any) => void;
};
export = jobCountManager;
