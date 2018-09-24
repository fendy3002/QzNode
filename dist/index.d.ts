declare var Service: () => {
    dataSet: any;
    exec: any;
    promise: any;
    logs: any;
    date: {
        dateRangeToArray: (from: string | import("moment").Moment, to: string | import("moment").Moment) => any[];
        dateDurationToArray: (from: import("moment").Moment, duration: number) => any[];
    };
    io: any;
    uuid: any;
    require: any;
    queue: any;
    fileLister: any;
    time: any;
};
export default Service;
