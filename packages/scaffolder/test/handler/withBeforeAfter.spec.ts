import * as mocha from 'mocha';
var assert = require('assert');
const util = require('util');

import baseHandleParam from './baseHandleParam';
import { withBeforeAfter } from '../../src/handler/withBeforeAfter';

mocha.describe('withBeforeAfter', function () {
    mocha.it('should do actions', async function () {
        let result = await withBeforeAfter({
            before: async (param) => {
                assert.equal(baseHandleParam.modelName, param.modelName);
                return { ...param, modelName: "model 2" };
            },
            handle: async (param) => {
                assert.equal("model 2", param.modelName);
                return { ...param, modelName: "model 3" };
            },
            after: async (param) => {
                assert.equal("model 3", param.modelName);
                return { ...param, modelName: "model 4" };
            },
        })({ ...baseHandleParam });
        assert.equal("model 4", result.modelName);
    });
});