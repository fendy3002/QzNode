import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import sa = require('superagent');
import chai = require('chai');
import nock = require('nock');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import handled from '../../src/errorHandler/handled';

let generateApp = () => {
  let express = require('express');
  return express();
}

let nockServer = "http://myownserver.com";
mocha.after(async function() {
  nock.cleanAll();
  return;
});
mocha.describe("errorHandler/handled", function(this) {
  mocha.it("Handle superagent error", async function(){
    let app = generateApp();
    nock(nockServer).get("/500").reply(500);
    app.get('/~', handled(async (req, res, next) => {
      await sa.get(nockServer + "/500");
      return res.end();
    }));
    app.use((err, req, res, next) => {
      res.status(err.status).json({
        message: err.message
      });
      res.end();
      return;
    });
    
    let resultResponse = await chai.request(app)
      .get('/~');
    assert.equal(500, resultResponse.status);
    assert.equal("Internal Server Error", resultResponse.body.message);
  });
  mocha.it("Handle code error", async function(){
    let app = generateApp();
    app.get('/~', handled(async (req, res, next) => {
      let i = null;
      i.toString();
      return res.end();
    }));
    app.use((err, req, res, next) => {
      res.status(err.status).json({
        message: err.message
      });
      res.end();
      return;
    });
    
    let resultResponse = await chai.request(app)
      .get('/~');
    assert.equal(500, resultResponse.status);
    assert.equal("Cannot read property 'toString' of null", resultResponse.body.message);
  });
});