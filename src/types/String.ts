export interface Base64Converter {
    encode: (val: string) => string,
    decode: (val: string) => string,
};
export interface ReplaceAll {
    (str: string, find: string, replace: string): string
};