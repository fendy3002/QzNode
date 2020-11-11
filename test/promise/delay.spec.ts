import * as mocha from 'mocha';
import * as QzPromise from '../../src/promise';
let assert = require('assert');
let lo = require('lodash');

mocha.describe('Delay promise', function () {
    mocha.it('should delay', async function () {
        let before = new Date().getTime();
        await QzPromise.delay.for(1000).exec();
        let after = new Date().getTime();
        assert.equal(true, (after - before) >= 1000);
    });
    mocha.it('should delay with elapsed handler', async function () {
        let before = new Date().getTime();
        let after = null;
        await QzPromise.delay.for(1000).onElapsed(async() => {
            after = new Date().getTime();
            assert.equal(true, (after - before) >= 1000);
        }).exec();
        assert.equal(true, after > before);
    });
});