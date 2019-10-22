import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import { yamlEval } from '../src/index';
mocha.describe("yamlEval", function (this) {
  mocha.it("should do comparison true", async function () {
    let data = {
      name: "Luke Skywalker",
      birth: "2000-03-12",
      total_price: 99999,
    };
    let expect = true;
    let condition =
      `
      $or:
        - $and:
          - $between:
            - $date: "2000-01-01"
            - $date:
                $prop: "birth"
            - $date: "2000-12-31"
          - $compare:
            - $prop: "name"
            - "starts_with"
            - "L"
        - $compare:
          - $prop: "total_price"
          - "gt"
          - 10000
      `;
    assert.equal(expect, await yamlEval()(data, condition));
  });
  mocha.it("should do comparison true (case 2)", async function () {
    let data = {
      name: "Luke Skywalker",
      birth: "2000-03-12",
      total_price: 99999,
    };
    let expect = true;
    let condition =
      `
      $or:
        - $and:
          - $between:
            - $date: "2001-01-01"
            - $date:
                $prop: "birth"
            - $date: "2001-12-31"
          - $compare:
            - $prop: "name"
            - "starts_with"
            - "K"
        - $compare:
          - $prop: "total_price"
          - "gt"
          - 10000
      `;
    assert.equal(expect, await yamlEval()(data, condition));
  });
  mocha.it("should do comparison false", async function () {
    let data = {
      name: "Luke Skywalker",
      birth: "2000-03-12",
      total_price: 99999,
    };
    let expect = false;
    let condition =
      `
      $or:
        - $and:
          - $between:
            - $date: "2001-01-01"
            - $date:
                $prop: "birth"
            - $date: "2001-12-31"
          - $compare:
            - $prop: "name"
            - "starts_with"
            - "K"
        - $compare:
          - $prop: "total_price"
          - "gt"
          - 100000
      `;
    assert.equal(expect, await yamlEval()(data, condition));
  });
  mocha.it("should do enum comparison", async function () {
    let data = {
      name: "Luke Skywalker",
      type: "PREMIUM",
      birth: "2000-03-12",
      total_price: 99999,
    };
    let expect = true;
    let condition =
      `
      $compare:
        - $prop: "type"
        - "in"
        - ["REGULAR", "PREMIUM", "VIP"]
      `;
    assert.equal(expect, await yamlEval()(data, condition));
  });
});