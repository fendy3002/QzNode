declare var Service: (log: any, options: any) => {
    _: any;
    message: (message: any) => void;
    messageln: (message: any) => void;
    object: (obj: any) => void;
    exception: (ex: any) => void;
};
export = Service;
