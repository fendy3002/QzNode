"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Service = function Service(_ref) {
    var _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 5 : _ref$limit;

    var qzPromiseToPromise = function qzPromiseToPromise(qzPromise) {
        if (qzPromise.before) {
            return qzPromiseToPromise(qzPromise.before).then(function (result) {
                return new Promise(qzPromise.callback(result));
            });
        } else {
            return new Promise(qzPromise.callback);
        }
    };
    var processPromises = function processPromises(qzPromises) {
        var onLoop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        return function () {
            var lastValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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

    return function (qzPromises) {
        var onLoop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!qzPromises || qzPromises.length == 0) {
            return new Promise(function (resolve) {
                return resolve(null);
            });
        }
        var lastPromise = null;
        for (var i = 0; i < qzPromises.length; i += limit) {
            var slicePromise = qzPromises.slice(i, i + limit);
            if (!lastPromise) {
                lastPromise = processPromises(slicePromise, onLoop)([]);
            } else {
                var currentPromise = processPromises(slicePromise, onLoop);
                var nextPromise = lastPromise.then(currentPromise);
                lastPromise = nextPromise;
            }
        }
        return lastPromise;
    };
};

exports.default = Service;