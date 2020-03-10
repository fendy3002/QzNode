import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import logRaw from '../../src/log';
mocha.describe("log", function (this) {
  mocha.it("should write correctly", async function () {
    let messages = [];
    let debugLog = logRaw({
      level: "debug",
      write: async (m) => {
        messages.push(m);
      }
    });
    debugLog("debug", "debug");
    debugLog("info", "info");
    debugLog("error", "error");
    assert.deepEqual([
      "debug",
      "info",
      "error"
    ], messages);
  });
  mocha.it("should ignore correctly", async function () {
    let messages = [];
    let debugLog = logRaw({
      level: "error",
      write: async (m) => {
        messages.push(m);
      }
    });
    debugLog("debug", "debug");
    debugLog("info", "info");
    debugLog("error", "error");
    assert.deepEqual([
      "error"
    ], messages);
  });
});