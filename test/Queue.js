let assert = require('assert');
let mysql = require('mysql');
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
        clearTable().then(() => {
            dispatcher({
                connection: connection
            }).dispatch(path.resolve(__dirname, '..', 'testHelper', 'run.js'), {
                param1: "value1",
                param2: "value2",
                name: "Luke Skywalker"
            }, {
                when: "2018-01-01",
                key: "11234"
            }).then((dispatchResult) => {
                assert.equal(!!dispatchResult.uuid, true);
                done();
            });
        });
    });
    it('should get from database', function(done) {
        runner({
            connection: connection,
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
                        }, 100);
                    });
                }, 35);
            });
    });
    it('should throw error if over than timeout', (done) => {
        let scriptName = path.resolve(__dirname, '..', 'testHelper', 'runEternity.js');
        let dispatcherObj = dispatcher({
            connection: connection
        });
        let runnerObj = runner({
            connection: connection,
            retry: 1,
            workerLimit: {
                [scriptName]: {limit: 1, timeout: 500},
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
        dispatching()
            .then(() => {
                runnerObj.once().then((err) => {
                    assert.equal(err.run, false);
                    assert.equal(err.code, "2");
                    assert.equal(err.error.run, false);
                    assert.equal(err.error.code, "4");
                    clearTable().then(done);
                    // done();
                });
            });
    }).timeout(2000);
});






let clearTable = () => {
    let db = mysql.createConnection({
        host     : connection.host,
        user     : connection.user,
        password : connection.password,
        database : connection.database,
        port     : connection.port,
        dateStrings: 'date',
        multipleStatements: true
    });
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            db.query("TRUNCATE TABLE qz_queue; TRUNCATE TABLE qz_queue_running;", (err) => {
                db.end();
                resolve();
            });
        });
    });
};