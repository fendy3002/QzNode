import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import BaseEntityManager from './BaseEntityManager';
import { generateIDMap } from '../../../src/dataGenerator/generateIDMap';

mocha.describe('generateIDMap', function () {
    mocha.it('generate', async function () {
        let generated = generateIDMap(BaseEntityManager);
        assert.equal(10, generated.MyModel.data.length);
        assert.equal(30, generated.MyModelRowCount.data.length);
        assert.equal(36, generated.MyModel.data[0].MyProp1.length); // is uuid
    });
});