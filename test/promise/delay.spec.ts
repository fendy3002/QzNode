import * as mocha from 'mocha';
import * as QzPromise from '../../src/promise';
let assert = require('assert');
let lo = require('lodash');

mocha.describe('Delay promise', function () {
    mocha.it('should delay', async function () {
        let before = new Date().getTime();
        await QzPromise.delay(async () => {
            let after = new Date().getTime();
            assert.equal(true, (after - before) >= 1000);
        }, 1000);
    });
});