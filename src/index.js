import promise from "./Promise/index.js";
import logs from "./Logs/index.js";
import io from "./IO/index.js";
import uuid from "./Uuid/index.js";

var Service = function() {
    return {
        promise: promise,
        logs: logs,
        io: io,
        uuid: uuid
    };
};

export default Service;