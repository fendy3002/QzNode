declare var Service: {
    deleteContentSync: (path: any) => void;
    mkdirRecursive: (targetDir: string, { isRelativeToScript }?: {
        isRelativeToScript?: boolean;
    }) => any;
};
export = Service;
