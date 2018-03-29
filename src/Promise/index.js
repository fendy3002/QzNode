import QzPromise from './QzPromise.js';
import limit from './limit.js';
import retry from './retry.js';

var Service = function(callback) {
    return new QzPromise(callback);
};

Service.limit = limit;
Service.retry = retry;

export default Service;