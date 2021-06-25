import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import * as jsonValidator from '../../../src/validator/json';

mocha.describe.only("validator json any object", function (this) {
  let schema = {
    "type": "object",
    "properties": {
      "content": {
        "type": "object"
      }
    },
    "required": ["content"]
  };
  mocha.it("validate any object", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      "content": {
        "any": "prop"
      }
    });

    addContext(this, {
      title: "result",
      value: result
    });
    assert.equal(true, result.isValid);
    assert.equal("prop", result.data.content.any);
  });
});