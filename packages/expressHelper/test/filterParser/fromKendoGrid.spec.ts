import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import fromKendoGrid from '../../src/filterParser/fromKendoGrid';

mocha.describe("filterParser fromKendoGrid", function (this) {
    mocha.it.only("should", async function () {
        let $filter = [
            `(startswith(ShipName,'toms')+and+OrderDate+gt+datetime'1997-02-06T00:00:00')`,
            `(startswith(ShipName,'toms')+and+OrderDate+gt+datetime'1997-02-06T00:00:00'+and+(Freight+ge+8.24+and+Freight+le+27.79))`,
            `(indexof(ProductName,'aa') eq -1 and UnitPrice eq 1)`,
            `(contains(ProductName,'aa') and UnitPrice eq 1)`
        ];

        let expectation = [
            // 0
            [
                {
                    "propertyName": "ShipName",
                    "operation": "starts_with",
                    "value": "toms"
                },
                {
                    "propertyName": "OrderDate",
                    "operation": "gt",
                    "value": new Date("1997-02-05T17:00:00.000Z")
                }
            ],
            // 1
            [
                {
                    "propertyName": "ShipName",
                    "operation": "starts_with",
                    "value": "toms"
                },
                {
                    "propertyName": "OrderDate",
                    "operation": "gt",
                    "value": new Date("1997-02-05T17:00:00.000Z")
                },
                {
                    "propertyName": "Freight",
                    "operation": "ge",
                    "value": "8.24"
                },
                {
                    "propertyName": "Freight",
                    "operation": "le",
                    "value": "27.79"
                }
            ],
            // 2
            [
                {
                    "propertyName": "ProductName",
                    "operation": "not_contains",
                    "value": "aa"
                },
                {
                    "propertyName": "UnitPrice",
                    "operation": "eq",
                    "value": 1
                }
            ],
            // 3
            [
                {
                    "propertyName": "ProductName",
                    "operation": "contains",
                    "value": "aa"
                },
                {
                    "propertyName": "UnitPrice",
                    "operation": "eq",
                    "value": 1
                }
            ]
        ];

        let index = 0;
        for (let each of $filter) {
            let source = each;
            assert.deepEqual(fromKendoGrid.toFilterObj(source), expectation[index]);
            // console.log(source.split("and").map(k => k.split("or").map(l => clean(l))))
            // console.log(index, source, source.split("(").map(k => clean(k)))
            // console.log(index, source, source.split(/[()]+/));
            index++;
        }
    })
});