import promise from "./Promise/index.js";
import logs from "./Logs/index.js";

var Service = function() {
    return {
        promise: promise,
        logs: logs
    };
};

export default Service;