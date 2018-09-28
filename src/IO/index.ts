import deleteContentSync = require('./deleteContentSync');
import mkdirRecursive = require('./mkdirRecursive');
var Service = {
    deleteContentSync: deleteContentSync,
    mkdirRecursive: mkdirRecursive
};

export = Service;