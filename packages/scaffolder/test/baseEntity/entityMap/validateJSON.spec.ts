import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import BaseEntityModelSingle from './BaseEntityModelSingle';
import entityMap from '../../../src/baseEntity/entityMap';

mocha.describe('validateJSON', function () {
    mocha.it('should generate json schema', async function () {
        let result = await entityMap.validateJSON({ model: BaseEntityModelSingle, action: "create" });
        console.log(result);
    });
});