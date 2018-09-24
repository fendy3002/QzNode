export {};
let reader = require('./reader/index');
let readerOutput = require('./reader/output.js');

var Service = () => ({
    reader: reader,
    readerOutput: readerOutput
});
module.exports = Service;