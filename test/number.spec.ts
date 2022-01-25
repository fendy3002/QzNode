import * as mocha from 'mocha';
import { thousandSeparator } from '../src/number';
let assert = require('assert');
let path = require('path');

mocha.describe('Number', function () {
    mocha.describe('thousandSeparator', function () {
        mocha.it('format a number without option', async function () {
            assert.equal("1,234", thousandSeparator(1234));
        });
        mocha.it('format a number with option', async function () {
            assert.equal("1.234,33", thousandSeparator(1234.33, {
                thousandSymbol: ".",
                decimalSymbol: ","
            }));
        });

        mocha.it('throw error when value is not a number', async function () {
            assert.throws(() => {
                //@ts-ignore
                thousandSeparator("a1234.33");
            }, Error);
        });
    });
});