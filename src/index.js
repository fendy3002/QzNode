import promise from "./Promise/index.js";
import logs from "./Logs/index.js";
import io from "./IO/index.js";
import uuid from "./Uuid/index.js";
import date from "./Date/index.js";
import require from "./Require.js";
import queue from "./Queue/index.js";

var Service = function() {
    return {
        promise: promise,
        logs: logs,
        date: date,
        io: io,
        uuid: uuid,
        require: require,
        queue: queue
    };
};

export default Service;