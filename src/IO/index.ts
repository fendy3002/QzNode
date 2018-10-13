import * as qz from '../types';

import deleteContentSync = require('./deleteContentSync');
import mkdirRecursive = require('./mkdirRecursive');

var Service: qz.IO.Service = {
    deleteContentSync: deleteContentSync,
    mkdirRecursive: mkdirRecursive
};

export = Service;