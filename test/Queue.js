let assert = require('assert');
let dispatcher = require('../src/Queue/dispatcher.js').default;
let runner = require('../src/Queue/runner.js').default;
let path = require('path');
let lo = require('lodash');

describe('QzQueue', function() {
    it('should insert to database', function(done) {
        dispatcher({
            connection: {
                host: "127.0.0.1",
                database: "tmp_db",
                port: "3306",
                user: "root",
                password: "password"
            }
        }).dispatch(path.resolve(__dirname, '..', 'testHelper', 'run.js'), {
            param1: "value1",
            param2: "value2",
            name: "Luke Skywalker"
        }, {
            when: "2018-01-01"
        }).then(() => {
            done();
        });
    });
    it('should get from database', function(done) {
        runner({
            connection: {
                host: "127.0.0.1",
                database: "tmp_db",
                port: "3306",
                user: "root",
                password: "password"
            }
        }).once().then((result) => {
            assert.equal(result.data, "RUN FUNCTION");
            done();
        });
    });
});