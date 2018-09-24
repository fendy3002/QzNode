"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv4 = require('uuid/v4');
var Service = function () {
    return uuidv4().replace(/\-/g, "");
};
module.exports = Service;
