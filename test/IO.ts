import * as mocha from 'mocha';

var assert = require('assert');
var qz = require('../src/index');
var lo = require('lodash');
var path = require('path');
var fs = require('fs');

mocha.describe('IO', function() {
    mocha.describe('deleteContent', function() {
        mocha.it('should delete all content in folder', function(done) {
            var storagePath = path.join(__dirname, "..", "storage", "test");
            fs.mkdir(storagePath, (err) => {
                fs.writeFile(path.join(storagePath, "file.txt"), "HELLO WORLD", (err) => {
                    qz().io.deleteContentSync(storagePath);

                    var files = fs.readdirSync(storagePath);
                    assert.equal(files.length, 0);
                    fs.rmdir(storagePath, (err) => {
                        done();
                    });
                });
            });
        });
    });
});