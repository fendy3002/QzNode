"use strict";

exports.underline = function (text) {
    return "\e[4m" + text + "\e[0m";
};
exports.newline = exports.br = function () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    return text + "\n";
};