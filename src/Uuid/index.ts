export {};

let uuidv4 = require('uuid/v4');

let Service = function(): string{
    return uuidv4().replace(/\-/g, "");
};

module.exports = Service;