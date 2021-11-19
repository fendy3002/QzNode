import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import BaseEntityManager from './BaseEntityManager';
import { generateIDMap } from '../../../src/dataGenerator/generateIDMap';

mocha.describe('generateIDMap', function () {
    mocha.it('generate', async function () {
        let generated = generateIDMap(BaseEntityManager);
        
        assert.equal(10, generated.MyModel.data.length);
        assert.equal(10, generated.MyModelNanoid.data.length);
        assert.equal(30, generated.MyModelRowCount.data.length);
        assert.equal(12, generated.MyModelNumber.data.length);

        assert.equal(36, generated.MyModel.data[0].MyProp1.length); // is uuid
        assert.equal(14, generated.MyModelNanoid.data[0].MyProp1.length); // is nanoid
        assert.equal("number", typeof generated.MyModelNumber.data[0].MyProp1);
        assert.equal(6, generated.MyModelNumber.data[5].MyProp1);
    });
});