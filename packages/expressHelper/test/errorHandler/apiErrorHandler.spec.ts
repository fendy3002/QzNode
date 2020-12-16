import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import sa = require('superagent');
import chai = require('chai');
import nock = require('nock');
import httpErrors = require('http-errors');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import apiErrorHandler from '../../src/errorHandler/apiErrorHandler';

let generateApp = () => {
    let express = require('express');
    return express();
}

let nockServer = "http://myownserver.com";
mocha.after(async function () {
    nock.cleanAll();
    return;
});
mocha.describe("errorHandler/apiErrorHandler", function (this) {
    mocha.it("Handle error", async function () {
        let app = generateApp();
        app.get('/~', async (req, res, next) => {
            return next(httpErrors(400, "User id is required", {
                code: "USER_ID_REQUIRED"
            }));
        });
        app.use(apiErrorHandler);

        let resultResponse = await chai.request(app)
            .get('/~');
        assert.equal(400, resultResponse.status);
        assert.equal("User id is required", resultResponse.body.message);
        assert.equal("USER_ID_REQUIRED", resultResponse.body.code);
    });
});