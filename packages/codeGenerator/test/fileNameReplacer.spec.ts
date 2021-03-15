import * as mocha from 'mocha';

import fileNameReplacer from '../src/fileNameReplacer';
var assert = require('assert');
const util = require('util');
mocha.describe('fileNameReplacer', function () {
    mocha.it('should replace', async function () {
        let schema = {
            Route: {
                Module: {
                    Code: "MyCode",
                    Code2: "MyCode2"
                }
            }
        };
        let fileNames = [
            "[Route.Module.Code].template",
            "[Route.Module.Code]-[Route.Module.Code].template",
            "[Route.Module.Code]-[Route.Module.Code2].template",
        ];
        let expected = [
            "MyCode",
            "MyCode-MyCode",
            "MyCode-MyCode2",
        ];
        let index = 0;
        for (let fileName of fileNames) {
            let replacedFileName = fileNameReplacer.replace(fileName, schema)
            assert.equal(replacedFileName, expected[index]);
            index++;
        }
    });
});