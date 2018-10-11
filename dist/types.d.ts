declare namespace qz {
    interface MySqlDbConnection {
        host: string;
        username: string;
        password: string;
        db: string;
        port: string;
    }
    interface PromiseCallback<T> {
        (resolve: (param?: T) => void, reject: (param?: T) => void): void;
    }
    interface QzService {
        (): {
            dataSet: DataSet.Service;
            exec: any;
            promise: any;
            logs: Logs.LogService;
            date: any;
            io: any;
            uuid: any;
            require: any;
            queue: any;
            fileLister: any;
            time: any;
        };
    }
}
declare namespace qz.DataSet {
    interface ArrToSet {
        (arr: any[], valHandler?: (val: any | string, index: number) => any, keyHandler?: (val: any, index: number) => string): object;
    }
    interface SetToArr {
        <T>(data: object, handler: (val: any, key: string) => T): T[];
    }
    interface Service {
        arrToSet: ArrToSet;
        setToArr: SetToArr;
    }
}
declare namespace qz.Logs {
    interface LogService {
        console: ConsoleLogService;
        empty: EmptyLogService;
        file: FileLogService;
        prefix: any;
        prefixTimed: any;
        timed: any;
    }
    interface ILog {
        message: (message: string) => void;
        messageln: (message: string) => void;
        object: (obj: object) => void;
        exception: (ex: object) => void;
    }
    interface ConsoleLog extends ILog {
        _: {
            stdout: any;
        };
    }
    interface ConsoleLogService {
        (callback?: (err: any, message: any) => void): ConsoleLog;
    }
    interface EmptyLogService {
        (callback: (err: any, message: any) => void): ILog;
    }
    interface FileLog extends ILog {
        _: {
            fs: any;
            encoding: string;
            done: () => void;
            pendings: {
                done: boolean;
            }[];
        };
        onDone: (cb: () => void) => boolean;
    }
    interface FileLogService {
        (filepath: string, callback: (err: any, message: any) => void): FileLog;
    }
}
export = qz;
