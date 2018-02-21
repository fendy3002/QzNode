exports.underline = (text) => {
    return "\e[4m" + text + "\e[0m";
};
exports.newline = exports.br = (text = "") => {
    return text + "\n";
};