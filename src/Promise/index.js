import limit from './limit.js';

let QzPromise = function(callback, before = null) {
    let result = {
        callback: callback,
        before: before,
        then: function(thenCallback) {
            return QzPromise(thenCallback, result);
        }
    };

    return result;
};

var Service = function(callback) {
    return QzPromise(callback);
};

Service.limit = limit;

export default Service;