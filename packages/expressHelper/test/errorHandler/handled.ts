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
      let result = await sa.get(nockServer + "/500");
      console.log(result);
      return res.end();
    }));
    app.use((err, req, res, next) => {
      assert.equal(500, err.status);
      assert.equal("Internal Server Error", err.message);
      res.end();
      return;
    });
    
    return await chai.request(app)
      .get('/~');
  });
});