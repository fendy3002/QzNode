import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import Sequelize = require('sequelize');
import sequelizeFilter from '../../src/filterParser/sequelize';

mocha.describe("filterParser sequelize", function (this) {
  mocha.it("should parse query to sequelize filter", async function () {
    let result = await sequelizeFilter({
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
      [Sequelize.Op.and]: [
        {
          "name": {
            [Sequelize.Op.eq]: "Luke Skywalker"
          }
        },
        {
          "userAge": {
            [Sequelize.Op.gte]: 20
          }
        }
      ]
    };
    assert.deepEqual(expected, result);
  });
  mocha.it("should throw key not found error", async function () {
    assert.rejects(async() => {
      await sequelizeFilter({
        "filter.name": "Luke Skywalker",
        "filter.age.from": "20"
      }, {
        "age": {
          "key": "userAge",
          "type": "number"
        }
      }, {
        prefix: "filter",
        validateKey: true,
        notFoundKeyError: true
      });
    },
      Error
    );
  });
  mocha.it("should parse date end", async function () {
    let result = await sequelizeFilter({
      "filter.name": "Luke Skywalker",
      "filter.birth.from": "2020-01-01"
    }, {
      "birth": {
        key: "birth",
        type: "date",
        formatTo: "YYYY-MM-DD HH:mm:ss",
        endOfDay: true
      }
    }, {
      prefix: "filter"
    });

    let expected = {
      [Sequelize.Op.and]: [
        {
          "name": {
            [Sequelize.Op.eq]: "Luke Skywalker"
          }
        },
        {
          "birth": {
            [Sequelize.Op.gte]: "2020-01-01 23:59:59"
          }
        }
      ]
    };
    assert.deepEqual(expected, result);
  });
});