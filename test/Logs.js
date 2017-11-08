var assert = require('assert');
var qz = require('../src/index.js').default();
var lo = require('lodash');
var path = require('path');

describe('Logs', function() {
    var testLog = function(log) {
        log.message("message");
        log.messageln("messageln");
        log.object({ "message" : "message" });
        log.exception(new Error("message"));
    };

    describe('EmptyLog', function() {
        it('should not write anything to console', function(done) {
            var context = {
                call: 0
            };
            var log = qz.logs.empty(() => { context.call++; });
            testLog(log);

            assert.equal(context.call, 4);
            done();
        });
    });

    describe('ConsoleLog', function() {
        it('should write to console', function(done) {
            var context = {
                call: 0,
                text: ""
            };
            var log = qz.logs.console(() => { context.call++; });
            log._.stdout = {
                write: (text) => { context.text += text; }
            };
            testLog(log);

            assert.equal(context.call, 4);
            assert.equal(context.text.length > 10, true);
            done();
        });
    });
    
    describe('FileLog', function() {
        it('should write to file', function(done) {
            var context = {
                call: 0,
                text: ""
            };
            var filepath = path.join(__dirname, "..", "storage", "test.log");
            var log = qz.logs.file(filepath, () => { context.call++; });
            log._.fs = {
                appendFile: (appendPath, text, encoding, callback) => {
                    setTimeout(() => {
                        context.text += text; 
                        assert.equal(appendPath, filepath);
                        callback(null);
                    }, 100);
                }
            };
            //log._.fs = require('fs');
            log.onDone(() => {
                assert.equal(context.call, 4);
                assert.equal(context.text.length > 10, true);
                done();
            });
            testLog(log);
        });
    });
});