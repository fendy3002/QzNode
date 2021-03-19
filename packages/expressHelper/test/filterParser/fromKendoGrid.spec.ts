import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import fromKendoGrid from '../../src/filterParser/fromKendoGrid';

mocha.describe("filterParser fromKendoGrid", function (this) {
    mocha.it("should parse to filter obj", async function () {
        let $filter = [
            `(startswith(ShipName,'toms')+and+OrderDate+gt+datetime'1997-02-06T00:00:00')`,
            `(startswith(ShipName,'toms')+and+OrderDate+gt+datetime'1997-02-06T00:00:00'+and+(Freight+ge+8.24+and+Freight+le+27.79))`,
            `(indexof(ProductName,'aa') eq -1 and UnitPrice eq 1)`,
            `(contains(ProductName,'aa') and UnitPrice eq 1)`,
            `(ProductName ne '' and UnitPrice eq 1)`
        ];

        let expectation = [
            // 0
            {
                and: [
                    {
                        starts_with: {
                            "propertyName": "ShipName",
                            "value": "toms"
                        }
                    },
                    {
                        gt: {
                            "propertyName": "OrderDate",
                            "value": new Date("1997-02-05T17:00:00.000Z")
                        }
                    }
                ]
            },
            // 1
            {
                and: [
                    {
                        "starts_with": {
                            "propertyName": "ShipName",
                            "value": "toms"
                        }
                    },
                    {
                        "gt": {
                            "propertyName": "OrderDate",
                            "value": new Date("1997-02-05T17:00:00.000Z")
                        }
                    },
                    {
                        "ge": {
                            "propertyName": "Freight",
                            "value": "8.24"
                        }
                    },
                    {
                        "le": {
                            "propertyName": "Freight",
                            "value": "27.79"
                        }
                    }
                ]
            },
            // 2
            {
                and: [
                    {
                        "not_contains": {
                            "propertyName": "ProductName",
                            "value": "aa"
                        }
                    },
                    {
                        "eq": {
                            "propertyName": "UnitPrice",
                            "value": 1
                        }
                    }
                ]
            },
            // 3
            {
                and: [
                    {
                        "contains": {
                            "propertyName": "ProductName",
                            "value": "aa"
                        }
                    },
                    {
                        "eq": {
                            "propertyName": "UnitPrice",
                            "value": 1
                        }
                    }
                ]
            },
            {
                and: [
                    {
                        "ne":
                        {
                            "propertyName": "ProductName",
                            "value": ""
                        }
                    },
                    {
                        "eq":
                        {
                            "propertyName": "UnitPrice",
                            "value": 1
                        }
                    }
                ]
            }
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