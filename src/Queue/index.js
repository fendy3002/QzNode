let dispatcher = require('./dispatcher');
let runner = require('./runner.js');

var Service = {
    dispatcher: dispatcher,
    runner: runner
};

module.exports = Service;