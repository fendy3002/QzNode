let assert = require('assert');
let dispatcher = require('../src/Queue/dispatcher.js').default;
let runner = require('../src/Queue/runner.js').default;
let path = require('path');
let lo = require('lodash');

let connection = {
    host: "127.0.0.1",
    database: "tmp_db",
    port: "3306",
    user: "root",
    password: "password"
};
describe('QzQueue', function() {
    it('should insert to database', function(done) {
        dispatcher({
            connection: connection
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
            connection: connection
        }).once().then((result) => {
            assert.equal(result.data, "RUN FUNCTION");
            done();
        });
    });
    it('should handle error', function(done) {
        dispatcher({
            connection: connection
        }).dispatch(path.resolve(__dirname, '..', 'testHelper', 'runError.js'), {
            param1: "value1",
            param2: "value2",
            name: "Luke Skywalker"
        }, {
            when: "2018-01-01"
        }).then(() => {
            let runnerObj = runner({
                connection: connection,
                retry: 1
            });
            runnerObj.once().then((result) => {
                assert.equal(result.run, false);
                assert.equal(result.error, "RUN ERROR");
                assert.equal(result.retry.retry, true);
                return runnerObj.once();
            }).then((result) => {
                assert.equal(result.run, false);
                assert.equal(result.error, "RUN ERROR");
                assert.equal(result.retry.retry, false);
                done();
            });
        });
    });
    it('should throw error if execute twice', function(done) {
        let scriptName = path.resolve(__dirname, '..', 'testHelper', 'runLonger.js');
        let dispatcherObj = dispatcher({
            connection: connection
        });
        let runnerObj = runner({
            connection: connection,
            retry: 1,
            workerLimit: {
                [scriptName]: {limit: 1}
            }
        });
        let dispatching = () => {
            return dispatcherObj.dispatch(scriptName, {
                param1: "value1",
                param2: "value2",
                name: "Luke Skywalker"
            }, {
                when: "2018-01-01"
            });
        };
        dispatching().then(dispatching)
            .then(() => {
                let p1 = runnerObj.once().then((result) => {
                    assert.equal(result.run, true);
                    assert.equal(result.data, "RUN LONGER");
                });
                setTimeout(() => {
                    let p2 = runnerObj.once().then((result) => {
                        assert.equal(result.run, false);
                        assert.equal(result.code, 3);
                    });
                    Promise.all([p1, p2]).then(() => {
                        setTimeout(() => {
                            runnerObj.once().then((result) => {
                                assert.equal(result.run, true);
                                assert.equal(result.data, "RUN LONGER");
                                done();
                            });
                        }, 35);
                    });
                }, 20);
            });
    });
});