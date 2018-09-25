"use strict";
var QzPromise = /** @class */ (function () {
    function QzPromise(callback, before) {
        if (before === void 0) { before = null; }
        this.callback = callback;
        this.before = before;
        this.then = function (thenCallback) {
            return new QzPromise(thenCallback, this);
        };
    }
    return QzPromise;
}());
;
module.exports = QzPromise;
