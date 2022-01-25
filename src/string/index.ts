import * as types from '../types';
// SOURCE: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
const escapeRegExp = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
export const replaceAll: types.String.ReplaceAll = (str: string, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const base64 : types.String.Base64Converter = {
    encode: (val: string) => {
        let buff = Buffer.from(val);
        return buff.toString('base64');
    },
    decode: (val: string) => {
        let buff = Buffer.from(val, "base64");
        return buff.toString('utf8');
    },
};