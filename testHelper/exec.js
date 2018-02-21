var assert = require('assert');
var qz = require('../src/index.js').default();
var lo = require('lodash');
var path = require('path');
var fs = require('fs');

qz.exec({
    connection:{
        host      : "127.0.0.1",
        user      : "root",
        password  : "password",
        database  : "dev_db",
        port      : 3306,
    }
});