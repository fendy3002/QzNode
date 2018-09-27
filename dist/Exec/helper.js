exports.underline = function (text) {
    return "\e[4m" + text + "\e[0m";
};
exports.newline = exports.br = function (text) {
    if (text === void 0) { text = ""; }
    return text + "\n";
};
