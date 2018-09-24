"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Service = function (_a) {
    var _b = _a.limit, limit = _b === void 0 ? 5 : _b;
    var qzPromiseToPromise = function (qzPromise) {
        if (qzPromise.before) {
            return qzPromiseToPromise(qzPromise.before).then(function (result) {
                return new Promise(qzPromise.callback(result));
            });
        }
        else {
            return new Promise(qzPromise.callback);
        }
    };
    var processPromises = function (qzPromises, onLoop) {
        if (onLoop === void 0) { onLoop = null; }
        return function (lastValue) {
            if (lastValue === void 0) { lastValue = []; }
            var promises = qzPromises.map(qzPromiseToPromise);
            return Promise.all(promises).then(function (values) {
                if (onLoop) {
                    onLoop(values);
                }
                var newValues = lastValue.concat(values);
                return newValues;
            });
        };
    };
    return function (qzPromises, onLoop) {
        if (onLoop === void 0) { onLoop = null; }
        if (!qzPromises || qzPromises.length == 0) {
            return new Promise(function (resolve) { return resolve(null); });
        }
        var lastPromise = null;
        for (var i = 0; i < qzPromises.length; i += limit) {
            var slicePromise = qzPromises.slice(i, i + limit);
            if (!lastPromise) {
                lastPromise = processPromises(slicePromise, onLoop)([]);
            }
            else {
                var currentPromise = processPromises(slicePromise, onLoop);
                var nextPromise = lastPromise.then(currentPromise);
                lastPromise = nextPromise;
            }
        }
        return lastPromise;
    };
};
module.exports = Service;
