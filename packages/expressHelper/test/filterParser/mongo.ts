import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import mongoFilter from '../../src/filterParser/mongo';

mocha.describe("filterParser mongo", function (this) {
  mocha.it("should parse query to mongo filter", async function () {
    let result = await mongoFilter({
      "filter.name": "Luke Skywalker",
      "filter.age.from": "20"
    }, {
      "age": {
        "key": "userAge",
        "type": "number"
      }
    }, {
        prefix: "filter"
      });

    let expected = {
      "$and": [
        {
          "name": {
            "$eq": "Luke Skywalker"
          }
        },
        {
          "userAge": {
            "$gte": 20
          }
        }
      ]
    };
    assert.deepEqual(expected, result);
  });
});