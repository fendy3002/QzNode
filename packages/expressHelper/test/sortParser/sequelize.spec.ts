import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import sequelizeSort from '../../src/sortParser/sequelize';

mocha.describe("sortParser sequelize", function (this) {
  mocha.describe("array", function (this) {
    mocha.it("should parse query to sequelize sort", async function () {
      let result = await sequelizeSort({
        "sort.1": "name,desc",
        "sort.0": "age",
      }, {
        "age": "userAge",
        "name": "userName"
      }, {
        prefix: "sort"
      }).array();

      let expected = [
        ["userAge", 'ASC'],
        ["userName", 'DESC']
      ];
      assert.deepEqual(expected, result);
    });
  });

  mocha.it("should throw key not found error", async function () {
    assert.rejects(async () => {
      let result = await sequelizeSort({
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