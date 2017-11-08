import promise from "./Promise/index.js";
import logs from "./Logs/index.js";
import io from "./IO/index.js";

var Service = function() {
    return {
        promise: promise,
        logs: logs,
        io: io
    };
};

export default Service;