import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import detectResolve from '../src/detectResolve';

mocha.describe("detectResolve", function (this) {
    mocha.it("should compare simple number comparison", async function () {
        let data = { total_price: 99999 };
        const conditions = [
            { expect: true, op: "gt", val: 10000 },
            { expect: true, op: "gte", val: 10000 },
            { expect: false, op: "gt", val: 99999 },
            { expect: true, op: "gte", val: 99999 },
            { expect: false, op: "gte", val: 100000 },
            { expect: true, op: "eq", val: 99999 },
            { expect: true, op: "ne", val: 100000 },
            { expect: false, op: "eq", val: 100000 },
            { expect: false, op: "ne", val: 99999 },
        ];
        for (let condition of conditions) {
            assert.equal(
                condition.expect,
                await detectResolve()(
                    data,
                    {
                        $compare: [
                            { $prop: "total_price" },
                            condition.op,
                            condition.val
                        ]
                    })
            );
        }
    });
    mocha.it("should compare simple number date comparison", async function () {
        let data = { birth: "2000-03-12 03:33:29" };
        const conditions = [
            { expect: true, op: "gt", val: { $date: "2000-03-10" } },
            { expect: true, op: "gte", val: { $date: "2000-03-10" } },
            { expect: false, op: "gt", val: { $date: "2000-03-13" } },
            { expect: true, op: "gte", val: { $date: "2000-03-12 03:33:29" } },
            { expect: false, op: "gte", val: { $date: "2000-03-13" } },
            { expect: true, op: "eq", val: { $date: "2000-03-12" } },
            { expect: true, op: "ne", val: { $date: "2000-03-11" } },
            { expect: false, op: "eq", val: { $date: "2000-03-11" } },
            { expect: false, op: "ne", val: { $date: "2000-03-12" } },
        ];
        for (let condition of conditions) {
            assert.equal(
                condition.expect,
                await detectResolve()(
                    data,
                    {
                        $compare: [
                            { $date: { $prop: "birth" } },
                            condition.op,
                            condition.val
                        ]
                    })
            );
        }
    });
    mocha.it("should compare enum", async function () {
        let data = { type: "PREMIUM" };
        const conditions = [
            { expect: true, op: "in", val: ["PREMIUM", "VIP"] },
            { expect: false, op: "in", val: ["REGULAR", "VIP"] }
        ];
        for (let condition of conditions) {
            assert.equal(
                condition.expect,
                await detectResolve()(
                    data,
                    {
                        $compare: [
                            { $prop: "type" },
                            condition.op,
                            condition.val
                        ]
                    })
            );
        }
    });
    mocha.it("should compare string", async function () {
        let data = { name: "Luke Skywalker" };
        const conditions = [
            { expect: true, op: "starts_with", val: "Luke" },
            { expect: false, op: "starts_with", val: "Lucas" },
            { expect: true, op: "ends_with", val: "Skywalker" },
            { expect: false, op: "ends_with", val: "Solo" },
        ];
        for (let condition of conditions) {
            assert.equal(
                condition.expect,
                await detectResolve()(
                    data,
                    {
                        $compare: [
                            { $prop: "name" },
                            condition.op,
                            condition.val
                        ]
                    })
            );
        }
    });
    mocha.it("should compare and or condition", async function () {
        let data = { birth: "2000-03-12 03:33:29", total_price: 12000 };
        let priceTrue = {
            $compare: [
                { $prop: "total_price" },
                "gt",
                5000
            ]
        };
        let priceFalse = {
            $compare: [
                { $prop: "total_price" },
                "gt",
                15000
            ]
        };
        let dateTrue = {
            $compare: [
                { $date: { $prop: "birth" } },
                "gt",
                { $date: "2000-01-01" }
            ]
        };
        let dateFalse = {
            $compare: [
                { $date: { $prop: "birth" } },
                "gt",
                { $date: "2000-04-01" }
            ]
        };
        let conditions = [
            {
                expect: true,
                logic: {
                    $and: [
                        priceTrue,
                        dateTrue
                    ]
                }
            },
            {
                expect: false,
                logic: {
                    $and: [
                        priceTrue,
                        dateFalse
                    ]
                }
            },
            {
                expect: true,
                logic: {
                    $or: [
                        priceTrue,
                        dateTrue
                    ]
                }
            },
            {
                expect: true,
                logic: {
                    $or: [
                        priceTrue,
                        dateFalse
                    ]
                }
            },
            {
                expect: false,
                logic: {
                    $or: [
                        priceFalse,
                        dateFalse
                    ]
                }
            },
            {
                expect: true,
                logic: {
                    $or: [
                        {
                            $and: [
                                priceTrue,
                                dateTrue
                            ]
                        },
                        dateFalse
                    ]
                }
            }
        ];
        for (let condition of conditions) {
            assert.equal(
                condition.expect,
                await detectResolve()(data, condition.logic)
            );
        }
    });
});