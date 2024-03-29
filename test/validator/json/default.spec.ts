import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import * as jsonValidator from '../../../src/validator/json';

mocha.describe("validator json", function (this) {
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
            "votes": "1600",
            "isWorkforce": false
        });
        assert.equal(true, result.isValid);
        assert.equal(1, result.data.address.lines.length);
        assert.equal(1600, result.data.votes);
    });
    mocha.it("validate json schema - empty date", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA"
            },
            "votes": "1600",
            "isWorkforce": false
        });
        assert.equal(true, result.isValid);
        assert.equal(1, result.data.address.lines.length);
        assert.equal(1600, result.data.votes);
    });
    mocha.it("validate error json schema - non number", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA"
            },
            "votes": "1600axxc123",
            "isWorkforce": false
        });
        assert.equal(false, result.isValid);
        assert.equal(1, result.data.address.lines.length);
        assert.equal(1, result.errors.length);
        assert.equal('instance.votes', result.errors[0].property);
    });
    mocha.it("validate error json schema - number, array format,", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-99-01",
            "address": {
                "lines": "1600 Pennsylvania Avenue Northwest",
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA"
            },
            "votes": "1600axxc123",
            "isWorkforce": false
        });
        assert.equal(false, result.isValid);
        assert.equal(2, result.errors.length);
        assert.equal('instance.address.lines', result.errors[0].property);
        assert.equal('instance.votes', result.errors[1].property);
    });
    mocha.it("validate error json schema - city string required", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "",
                "country": "USA"
            },
            "votes": "1600",
            "isWorkforce": false
        });
        assert.equal(false, result.isValid);
        assert.equal(1, result.errors.length);
        assert.equal('instance.address.city', result.errors[0].property);
    });
    mocha.it("validate error json schema - country string required", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": ""
            },
            "votes": "1600",
            "isWorkforce": false
        });
        assert.equal(false, result.isValid);
        assert.equal(1, result.errors.length);
        assert.equal('instance.address.country', result.errors[0].property);
    });
    mocha.it("validate error json schema - string null not error", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA",
                "area": null
            },
            "votes": "1600",
            "isWorkforce": false
        });
        assert.equal(true, result.isValid);
    });
    mocha.it("validate error json schema - date format", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-99-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA",
                "area": null
            },
            "votes": "1600",
            "isWorkforce": false
        });
        assert.equal(false, result.isValid);
        assert.equal("instance.birth", result.errors[0].property);
        assert.equal("Birth date", result.errors[0].name);
    });
    mocha.it("validate json schema - boolean format", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA",
                "area": null
            },
            "votes": "1600",
            "isWorkforce": "false",
            "isVip": ""
        });
        assert.equal(true, result.isValid);
        assert.equal(false, result.data.hasOwnProperty("isVip"));
    });
    mocha.it("validate error json schema - boolean format required", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA",
                "area": null
            },
            "votes": "1600",
            "isWorkforce": ""
        });
        assert.equal(false, result.isValid);
    });
    mocha.it("validate error json schema - boolean format incorrect", async function () {
        let result = await jsonValidator.schema(schema).validate<any>({
            "name": "Barack Obama",
            "birth": "2010-01-01",
            "address": {
                "lines": ["1600 Pennsylvania Avenue Northwest"],
                "zip": "DC 20500",
                "city": "Washington",
                "country": "USA",
                "area": null
            },
            "votes": "1600",
            "isWorkforce": "TRUE"
        });
        assert.equal(false, result.isValid);
    });
});