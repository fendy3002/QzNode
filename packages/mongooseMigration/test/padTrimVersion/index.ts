import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import padVersion from '../../src/padVersion';
import trimVersion from '../../src/trimVersion';

mocha.describe("padTrimVersion", function (this) {
  mocha.it("should pad version correctly", async function () {
    let testData = [
      { v: "2.3.5", e: "0002.0003.0005" },
      { v: "12.3.25", e: "0012.0003.0025" },
      { v: "102.303.5", e: "0102.0303.0005" },
    ];
    for (let each of testData) {
      assert(each.e, padVersion(each.v));
    }
  });
  mocha.it("should trim version correctly", async function () {
    let testData = [
      { e: "2.3.5", v: "0002.0003.0005" },
      { e: "12.3.25", v: "0012.0003.0025" },
      { e: "102.303.5", v: "0102.0303.0005" },
    ];
    for (let each of testData) {
      assert(each.e, trimVersion(each.v));
    }
  });
});