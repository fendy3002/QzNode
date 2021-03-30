import * as mocha from 'mocha';
import qzExcel from '../src/excel';
let assert = require('assert');
import moment = require('moment');
let path = require('path');

mocha.describe('Excel', function () {
    mocha.describe('readAllRows', function () {
        mocha.it('return all record from sheet', async function () {
            let filePath = path.join(__dirname, "/excelsheet1.xlsx");
            let result = await qzExcel.fromFilePath(filePath).getSheets()[0].readAllRows({
                OrderDate: "A",
                Region: "B",
                Rep: "C",
                Item: "D",
                Units: "E",
                UnitCost: "F",
                Total: "G",
            });
            assert.equal(30, result.length);
            assert.equal(30, result[29]._row);
            assert.equal("Central", result[29].Region);
        });
    });
});