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
            { expect: true,     op: "gt",   val: { $date: "2000-03-10" } },
            { expect: true,     op: "gte",  val: { $date: "2000-03-10" } },
            { expect: false,    op: "gt",   val: { $date: "2000-03-13" } },
            { expect: true,     op: "gte",  val: { $date: "2000-03-12 03:33:29" } },
            { expect: false,    op: "gte",  val: { $date: "2000-03-13" } },
            { expect: true,     op: "eq",   val: { $date: "2000-03-12" } },
            { expect: true,     op: "ne",   val: { $date: "2000-03-11" } },
            { expect: false,    op: "eq",   val: { $date: "2000-03-11" } },
            { expect: false,    op: "ne",   val: { $date: "2000-03-12" } },
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
});