import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import baseHandleParam from './baseHandleParam';
import { withBeforeAfter } from '../../src/handler/withBeforeAfter';

mocha.describe('withBeforeAfter', function () {
    mocha.it('should do actions', async function () {
        let result = await withBeforeAfter({
            before: async (param) => {
                assert.equal(null, param.context["MyProp"]);
                param.context["MyProp"] = "prop1";
                return { ...param };
            },
            handle: async (param) => {
                assert.equal("prop1", param.context["MyProp"]);
                param.context["MyProp"] = "prop2";
                return { ...param };
            },
            after: async (param) => {
                assert.equal("prop2", param.context["MyProp"]);
                param.context["MyProp"] = "prop3";
                return { ...param };
            },
        })({ ...baseHandleParam });
        assert.equal("prop3", result.context["MyProp"]);
    });
});