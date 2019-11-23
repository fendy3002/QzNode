import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import moment = require('moment');
import propResolve from '../src/propResolve';

mocha.describe("propResolve", function (this) {
    let data = [{
        "id": "21da8231-b536-4c43-b4fc-ebd087696a4b",
        "firstName": "Tobio",
        "lastName": "MacGuire",
        "gender": "male",
        "birth": "1945-07-15",
        "address": {
            "streetName": "65 Valley View St.",
            "zipCode": "60099",
            "stateCode": "IL"
        },
        "contact": {
            "mobile": "209-731-2703",
            "home": "559-871-3815"
        },
        "height": 182,
        "type": "REGULAR"
    }];

    mocha.it("should return correct firstName", async function () {
        let logic = {
            $prop: "firstName"
        };
        let expected = "Tobio"

        let actual = await propResolve()(data[0], logic);
        assert.equal(expected, actual);
    });
    mocha.it("should return correct birth", async function () {
        let logic = {
            $date: {
                $prop: "birth"
            }
        };
        let expected = moment(data[0].birth);

        let actual = await propResolve()(data[0], logic);
        assert.equal(expected.format("YYYY-MM-DD"), moment(actual).format("YYYY-MM-DD"));
    });
    mocha.it("should return correct timestamp", async function () {
        let logic = {
            $date: {
                $prop: "birth"
            },
            formatTo: "timestamp"
        };
        let expected = moment(data[0].birth).valueOf();

        let actual = await propResolve()(data[0], logic);
        assert.equal(expected, actual);
    });
    mocha.it("should parse correct birth", async function () {
        let logic = {
            $date: {
                $prop: "birth"
            },
            formatFrom: "YYYY-MM-DD",
            formatTo: "timestamp"
        };
        let expected = moment(data[0].birth).valueOf();

        let actual = await propResolve()(data[0], logic);
        assert.equal(expected, actual);
    });
});