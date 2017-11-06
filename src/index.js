import limit from "./Promise/limit.js";

var Service = function() {
    return {
        promise: {
            limit: limit
        }
    };
};

export default Service;