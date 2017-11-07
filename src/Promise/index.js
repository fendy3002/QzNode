import limit from './limit.js';

var Service = function(callback) {
    return {
        callback: callback
    };
};

Service.limit = limit;

export default Service;