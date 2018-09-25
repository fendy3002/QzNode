declare var Service: (filepath: any, callback?: (err: any, message: any) => void) => {
    _: {
        fs: any;
        encoding: string;
        done: () => void;
        pendings: any[];
    };
    onDone: (cb: any) => boolean;
    message: (message: any) => void;
    messageln: (msg: any) => void;
    object: (obj: any) => void;
    exception: (ex: any) => void;
};
export = Service;
