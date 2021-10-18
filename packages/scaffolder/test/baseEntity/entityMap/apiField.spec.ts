import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import BaseEntityModelParent from './BaseEntityModelParent';
import BaseEntityModelSingle from './BaseEntityModelSingle';
import entityMap from '../../../src/baseEntity/entityMap';

mocha.describe('apiField', function () {
    mocha.it('should map single data', async function () {
        let data = {
            MyProp1: "string",
            MyProp2: "99.33",
            MyProp3: 1,
        };
        let actual = await entityMap.apiField({
            context: {},
            data: data,
            model: BaseEntityModelSingle,
            willMapAssociation: true
        });
        let expected = { MyProp1: 'string', MyProp2: 99.33, MyProp3: true };
        assert.deepEqual(expected, actual);
    });
    mocha.it('should map parent child data', async function () {
        let data = {
            MyProp1: "string",
            MyProp2: "99.33",
            MyProp3: 1,
            myChild: {
                MyProp1: "childString",
                MyProp2: "199.33",
                MyProp3: "true",
            }
        };
        let actual = await entityMap.apiField({
            context: {},
            data: data,
            model: BaseEntityModelParent,
            willMapAssociation: true
        });
        let expected = {
            MyProp1: 'string', MyProp2: 99.33, MyProp3: true,
            myChild: { MyProp1: 'childString', MyProp2: 199.33, MyProp3: true }
        };
        assert.deepEqual(expected, actual);
    });
});