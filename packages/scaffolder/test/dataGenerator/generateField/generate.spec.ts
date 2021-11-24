import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import BaseEntityManager from '../models/BaseEntityManager';
import { generateIDMap } from '../../../src/dataGenerator/generateIDMap';
import { generateRelation } from '../../../src/dataGenerator/generateRelation';
import { generateField } from '../../../src/dataGenerator/generateField';

mocha.describe('generateField', function () {
    mocha.it('generate', async function () {
        let generatedIdMap = generateIDMap(BaseEntityManager);
        let generated = generateRelation(BaseEntityManager, generatedIdMap);
        generated = generateField(BaseEntityManager, generated);

        console.log(JSON.stringify(generated));
    });
});