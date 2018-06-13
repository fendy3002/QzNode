import reader from './reader/index.js';
import readerLog from './reader/log.js';
import readerOutput from './reader/output.js';

var Service = () => ({
    reader: reader,
    readerLog: readerLog,
    readerOutput: readerOutput
});
export default Service;