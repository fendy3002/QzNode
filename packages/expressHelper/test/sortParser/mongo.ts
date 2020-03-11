import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import mongoSort from '../../src/sortParser/mongo';

mocha.describe("sortParser mongo", function (this) {
  mocha.describe("array", function (this) {
    mocha.it("should parse query to mongo sort", async function () {
      let result = await mongoSort({
        "sort.1": "name,desc",
        "sort.0": "age",
      }, {
        "age": "userAge",
        "name": "userName"
      }, {
        prefix: "sort"
      }).array();
  
      let expected = [
        ["userAge", 1],
        ["userName", -1]
      ];
      assert.deepEqual(expected, result);
    });
  });
  mocha.describe("string", function (this) {
    mocha.it("should parse query to mongo sort", async function () {
      let result = await mongoSort({
        "sort.1": "name,desc",
        "sort.0": "age",
      }, {
        "age": "userAge",
        "name": "userName"
      }, {
        prefix: "sort"
      }).string();
  
      let expected = "userAge -userName";
      assert.deepEqual(expected, result);
    });
  });

  mocha.it("should throw key not found error", async function () {
    assert.rejects(async() => {
      let result = await mongoSort({
        "sort.0": "age",
        "sort.1": "name,desc"
      }, {
        "age": "userAge",
      }, {
        prefix: "sort"
      }).array();
    },
      Error
    );
  });
});