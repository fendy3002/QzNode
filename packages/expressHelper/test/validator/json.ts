import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import * as jsonValidator from '../../src/validator/json';

mocha.describe("validator json", function (this) {
  let schema = {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "birth": {
        'type': 'string',
        'format': 'date'
      },
      "address": {
        "type": "object",
        "properties": {
          "lines": {
            "type": "array",
            "items": { "type": "string" }
          },
          "zip": { "type": "string" },
          "city": { "type": "string" },
          "country": { "type": "string" }
        },
        "required": ["country"]
      },
      "votes": { "type": "integer", "minimum": 1 }
    }
  };
  mocha.it("validate json schema", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      "name": "Barack Obama",
      "birth": "2010-01-01",
      "address": {
        "lines": ["1600 Pennsylvania Avenue Northwest"],
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
      },
      "votes": "1600"
    });

    assert.equal(true, result.isValid);
    assert.equal(1, result.data.address.lines.length);
    assert.equal(1600, result.data.votes);
  });
  mocha.it("validate error json schema (1)", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      "name": "Barack Obama",
      "birth": "2010-01-01",
      "address": {
        "lines": ["1600 Pennsylvania Avenue Northwest"],
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
      },
      "votes": "1600axxc123"
    });

    assert.equal(false, result.isValid);
    assert.equal(1, result.data.address.lines.length);
    assert.equal(1, result.message.length);
    assert.equal('votes', result.message[0]);
  });
  mocha.it("validate error json schema (2)", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      "name": "Barack Obama",
      "birth": "2010-99-01",
      "address": {
        "lines": "1600 Pennsylvania Avenue Northwest",
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
      },
      "votes": "1600axxc123"
    });

    assert.equal(false, result.isValid);
    assert.equal(2, result.message.length);
    assert.equal('address.lines', result.message[0]);
    assert.equal('votes', result.message[1]);
  });
});