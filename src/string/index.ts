
// SOURCE: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
const escapeRegExp = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
const replaceAll = (str: string, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

const base64 = {
    encode: (val: string) => {
        let buff = new Buffer(val);
        return buff.toString('base64');
    },
    decode: (val: string) => {
        let buff = new Buffer(val, "base64");
        return buff.toString('ascii');
    },
}
export {
    base64,
    replaceAll
};