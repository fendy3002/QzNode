import promise from "./Promise/index.js";
import logs from "./Logs/index.js";
import io from "./IO/index.js";
import uuid from "./Uuid/index.js";
import require from "./Require.js";

var Service = function() {
    return {
        promise: promise,
        logs: logs,
        io: io,
        uuid: uuid,
        require: require
    };
};

export default Service;