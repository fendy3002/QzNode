import reader from './reader/index.js';
import readerOutput from './reader/output.js';

var Service = () => ({
    reader: reader,
    readerOutput: readerOutput
});
export default Service;