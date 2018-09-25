import * as mocha from 'mocha';

var assert = require('assert');
var qz = require('../src/index');
var lo = require('lodash');
var path = require('path');

mocha.describe('Logs', function() {
    var testLog = function(log) {
        log.message("message");
        log.messageln("messageln");
        log.object({ "message" : "message" });
        log.exception(new Error("message"));
    };

    mocha.describe('EmptyLog', function() {
        mocha.it('should not write anything to console', function(done) {
            var context = {
                call: 0
            };
            var log = qz().logs.empty(() => { context.call++; });
            testLog(log);

            assert.equal(context.call, 4);
            done();
        });
    });

    mocha.describe('ConsoleLog', function() {
        mocha.it('should write to console', function(done) {
            var context = {
                call: 0,
                text: ""
            };
            var log = qz().logs.console(() => { context.call++; });
            log._.stdout = {
                write: (text) => { context.text += text; }
            };
            testLog(log);

            assert.equal(context.call, 4);
            assert.equal(context.text.length > 10, true);
            done();
        });
    });
    
    mocha.describe('FileLog', function() {
        mocha.it('should write to file', function(done) {
            var context = {
                call: 0,
                text: ""
            };
            var filepath = path.join(__dirname, "..", "storage", "test.log");
            var log = qz().logs.file(filepath, () => { context.call++; });
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
    
    mocha.describe('Prefix and Time Log', function() {
        mocha.it('should write to console', function(done) {
            var context = {
                call: 0,
                text: ""
            };
            
            var consoleLog = qz().logs.console(() => { context.call++; });
            var log = qz().logs.prefix(
                qz().logs.timed(
                    consoleLog
                ), {
                    "prefix": "TEST"
                });
            consoleLog._.stdout = {
                write: (text) => { context.text += text; }
            };
            testLog(log);

            assert.equal(context.call, 8);
            assert.equal(context.text.length > 10, true);
            done();
        });
    });
    
    mocha.describe('PrefixTimed Log', function() {
        mocha.it('should write to console', function(done) {
            var context = {
                call: 0,
                text: ""
            };
            
            var consoleLog = qz().logs.console(() => { context.call++; });
            var log = qz().logs.prefixTimed(consoleLog, {
                    "prefix": "TEST"
                });
            consoleLog._.stdout = {
                write: (text) => { context.text += text; }
            };
            testLog(log);

            assert.equal(context.call, 6);
            assert.equal(context.text.length > 10, true);
            done();
        });
    });
});