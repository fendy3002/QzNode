/// <reference types="node" />
declare var Service: (callback?: (err: any, message: any) => void) => {
    message: (message: any) => void;
    messageln: (message: any) => void;
    object: (obj: any) => void;
    exception: (ex: any) => void;
    _: {
        stdout: NodeJS.WriteStream;
    };
};
export = Service;
