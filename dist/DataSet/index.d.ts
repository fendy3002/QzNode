declare let Service: {
    arrToSet: (arr: any[], valHandler?: (val: any, index: number) => any, keyHandler?: (val: any, index: number) => string) => object;
    setToArr: <T>(data: object, handler?: (val: any, key: string) => T) => T[];
};
export = Service;
