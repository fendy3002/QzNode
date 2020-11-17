var assert = require('assert');
import * as mocha from 'mocha';
import * as QzFunc from '../src/func';
mocha.describe('Func', function () {
    mocha.it('should silent error', async function () {
        let isError = false;
        QzFunc.silent(() => {
            throw new Error("Custom");
        }, (ex) => {
            assert.equal(ex.message, "Custom");
            isError = true;
        });
        assert.equal(isError, true);
    });
    mocha.it('should silent error async', async function () {
        let isError = false;
        await QzFunc.silentAsync(async () => {
            throw new Error("Custom");
        }, async (ex) => {
            assert.equal(ex.message, "Custom");
            isError = true;
        });
        assert.equal(isError, true);
    });
});