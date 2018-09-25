declare let Service: {
    arrToSet: <T>(arr: any[], handler?: (val: T, index: number) => any) => object;
    setToArr: <T>(data: object, handler?: (val: any, key: string) => T) => T[];
};
export = Service;
