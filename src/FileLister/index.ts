let reader = require('./reader/index');
let readerOutput = require('./reader/output');

var Service = () => ({
    reader: reader,
    readerOutput: readerOutput
});
export = Service;