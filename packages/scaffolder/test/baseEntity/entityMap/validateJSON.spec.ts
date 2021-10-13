import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import BaseEntityModelSingle from './BaseEntityModelSingle';
import entityMap from '../../../src/baseEntity/entityMap';

mocha.describe('validateJSON', function () {
    mocha.it('should generate json schema', async function () {
        let result = await entityMap.validateJSON({ model: BaseEntityModelSingle, action: "create" });
        let expected = {
            type: 'object',
            properties: {
                MyProp1: { type: 'string', maxLength: 50 },
                MyProp2: { type: 'number' }
            }
        };
        assert.deepEqual(expected, result);
    });
});