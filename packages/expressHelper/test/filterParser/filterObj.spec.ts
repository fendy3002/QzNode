import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import Sequelize = require('sequelize');
import addContext = require('mochawesome/addContext');
import filterObj from '../../src/filterParser/filterObj';

mocha.describe.only("filterParser filterObj", function (this) {
    mocha.it.only("should parse to sequelize", async function () {
        let source = {
            and: [
                {
                    "eq": {
                        propertyName: "name",
                        value: "Luke Skywalker"
                    }
                },
                {
                    "lte": {
                        propertyName: "birth",
                        value: "2020-12-01"
                    }
                }
            ]
        };
        let expected = {
            [Sequelize.Op.and]: [
                {
                    "name": {
                        [Sequelize.Op.eq]: "Luke Skywalker"
                    }
                },
                {
                    "birth": {
                        [Sequelize.Op.lte]: "2020-12-01"
                    }
                }
            ]
        };

        assert.deepEqual(filterObj.toSequelize(source), expected);
    })
});