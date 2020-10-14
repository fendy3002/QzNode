
// SOURCE: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
const escapeRegExp = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export {
    replaceAll
};