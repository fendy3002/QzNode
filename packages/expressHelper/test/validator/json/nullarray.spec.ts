import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import * as jsonValidator from '../../../src/validator/json';

mocha.describe("validator json null array", function (this) {
  let schema = {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "birth": {
        'type': 'string',
        'format': 'date',
        'name': "Birth date"
      },
      "address": {
        "type": "object",
        "properties": {
          "lines": {
            "type": "array",
            "items": { "type": "string" }
          },
          "zip": { "type": "string" },
          "city": { "type": "string", "required": true },
          "country": { "type": "string" },
          "area": { "type": "string" }
        },
        "required": ["country"]
      },
      "votes": { "type": "integer", "minimum": 1 },
      "isWorkforce": { "type": "boolean" },
      "isVip": { "type": "boolean" }
    },
    "required": ["isWorkforce"]
  };
  mocha.it("validate json schema - null array", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      "name": "Barack Obama",
      "birth": "2010-01-01",
      "address": {
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
      },
      "votes": "1600",
      "isWorkforce": false
    });

    addContext(this, {
      title: "result",
      value: result
    });
    assert.equal(true, result.isValid);
    assert.equal(1600, result.data.votes);
  });
  mocha.it("validate error json schema - null array required", async function () {
    let validateSchema = {
      ...schema,
      properties: {
        ...schema.properties,
        address: {
          ...schema.properties.address,
          properties: {
            ...schema.properties.address.properties,
            lines: {
              "type": "array",
              "items": { "type": "string" }
            }
          },
          required: [
            ...schema.properties.address.required,
            "lines"
          ]
        }
      }
    }
    let result = await jsonValidator.schema(validateSchema).validate<any>({
      "name": "Barack Obama",
      "birth": "2010-01-01",
      "address": {
        "zip": "DC 20500",
        "city": "Washington",
        "country": "USA"
      },
      "votes": "1600",
      "isWorkforce": false
    });

    addContext(this, {
      title: "result",
      value: result
    });
    assert.equal(false, result.isValid);
    assert.equal(1, result.errors.length);
  });

  mocha.it("validate json schema - null object", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      "name": "Barack Obama",
      "birth": "2010-01-01",
      "votes": "1600",
      "isWorkforce": false
    });

    addContext(this, {
      title: "result",
      value: result
    });
    assert.equal(true, result.isValid);
    assert.equal(1600, result.data.votes);
  });
});