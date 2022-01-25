export interface Append {
    (innerErr: any, newErr: any): any
};

export interface From {
    (innerErr): {
        error: (err: any) => any,
        message: (message: string) => any,
        original: () => {
            asIs: () => any,
            message: (message: string) => any
        }
    }
};