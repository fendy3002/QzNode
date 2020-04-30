import * as mocha from 'mocha';
import * as QzPromise from '../../src/promise';
let assert = require('assert');
let lo = require('lodash');

mocha.describe('Limit', function () {
    mocha.it('should execute 5 promises simultaneously', async function () {
        const promises = [];
        const expected = [];
        for (let i = 0; i < 100; i++) {
            expected.push(i);
            promises.push(async () => {
                return i;
            });
        }
        let loop = 0;
        const result = await QzPromise.limit(promises, 5, {
            onLoop: async (values) => {
                loop++;
                assert.equal(5, values.length);
            }
        });
        assert.equal(20, loop);
        assert.equal(100, result.length);
        assert.deepEqual(expected, result);
    });
    mocha.it('should execute 5 promises simultaneously without onloop', async function () {
        const promises = [];
        const expected = [];
        for (let i = 0; i < 100; i++) {
            expected.push(i);
            promises.push(async () => {
                return i;
            });
        }
        const result = await QzPromise.limit(promises, 5);
        assert.equal(100, result.length);
        assert.deepEqual(expected, result);
    });

});